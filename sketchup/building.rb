# encoding: UTF-8
# building.rb — Detailed 4-storey mixed-use building generator for SketchUp.
#
# Run inside SketchUp:
#   Window  Ruby Console
#   load '/Users/bambangperwitosoteto/vlaude/sketchup/building.rb'
#
# Produces a single top-level group named "MixedUseBuilding" containing:
#   Site (grass + sidewalk + 2 trees)
#   5 floor slabs (ground + 3 + roof)
#   Storey 1 (retail) — full glass shopfront with double doors
#   Storeys 2-4 (apartments) — windows on every facade, 2 balconies on the front
#   Stairwell shaft at back-right corner
#   Cornice band at every floor line
#   1.1 m parapet around the roof with stone cap

module BuildingBuilder
  # ---------- Dimensions (metres) ----------
  WIDTH         = 20.0
  DEPTH         = 15.0
  STOREY_H      = 3.5
  N_STOREYS     = 4
  SLAB_T        = 0.2
  WALL_T        = 0.2
  PARAPET_H     = 1.1
  PARAPET_T     = 0.2
  PARAPET_CAP_T = 0.08
  CORNICE_PROJ  = 0.18
  CORNICE_H     = 0.30

  WIN_W         = 1.4
  WIN_H         = 1.6
  WIN_FRAME_D   = 0.10
  WIN_SILL_Z    = 0.9

  BALC_W        = 4.0
  BALC_D        = 1.4
  BALC_SLAB_T   = 0.15
  BALC_RAIL_H   = 1.1

  DOOR_SHOP_W   = 1.8
  DOOR_SHOP_H   = 2.6
  DOOR_RES_W    = 0.95
  DOOR_RES_H    = 2.10

  SITE_PAD      = 6.0
  SIDEWALK_D    = 4.0

  # ---------- Materials (RGB or RGBA) ----------
  COLORS = {
    brick:     [160,  82,  45],
    render:    [245, 241, 232],
    glass:     [166, 205, 232, 0.35],
    frame:     [ 44,  44,  44],
    metal:     [136, 136, 136],
    stone:     [216, 210, 194],
    door_wood: [ 92,  58,  33],
    concrete:  [191, 191, 191],
    grass:     [111, 168,  75],
    foliage:   [ 62, 124,  42],
    trunk:     [ 90,  60,  30],
  }

  @materials  = {}
  @components = {}

  # ============================================================
  # ENTRY POINT
  # ============================================================
  def self.build!
    model = Sketchup.active_model
    model.start_operation('Build Mixed-Use Building', true)
    begin
      setup_materials(model)
      define_components(model)

      root = model.entities.add_group
      root.name = 'MixedUseBuilding'
      e = root.entities

      g = e.add_group; g.name = 'Site';            draw_site(g)
      g = e.add_group; g.name = 'FloorSlabs';      draw_floor_slabs(g)
      g = e.add_group; g.name = 'Storey1_Retail';  draw_retail_storey(g)
      (1..3).each do |i|
        sg = e.add_group; sg.name = "Storey#{i + 1}_Apartments"
        draw_apartment_storey(sg, i)
      end
      g = e.add_group; g.name = 'Stairwell';       draw_stairwell(g)
      g = e.add_group; g.name = 'Cornices';        draw_cornices(g)
      g = e.add_group; g.name = 'Parapet';         draw_parapet(g)

      model.active_view.zoom_extents
      model.commit_operation
      puts "[OK] MixedUseBuilding built (#{Time.now.strftime('%H:%M:%S')})"
    rescue => err
      model.abort_operation
      puts "[FAIL] #{err.class}: #{err.message}"
      puts err.backtrace.first(15).join("\n")
      raise
    end
  end

  # ============================================================
  # GEOMETRY HELPERS
  # ============================================================
  def self.pt(x, y, z)
    Geom::Point3d.new(x.m, y.m, z.m)
  end

  def self.vec(x, y, z)
    Geom::Vector3d.new(x.m, y.m, z.m)
  end

  # Axis-aligned box as its own group (won't merge with siblings).
  def self.box(parent_ents, x, y, z, sx, sy, sz, material = nil, name = nil)
    g = parent_ents.add_group
    g.name = name if name
    p1 = pt(x, y, z)
    p2 = pt(x + sx, y, z)
    p3 = pt(x + sx, y + sy, z)
    p4 = pt(x, y + sy, z)
    f = g.entities.add_face(p1, p2, p3, p4)
    f.reverse! if f.normal.z.to_f < 0
    f.pushpull(sz.m)
    g.material = material if material
    g
  end

  # Rotation around Z at origin, angle in radians.
  def self.rot_z(angle_rad)
    Geom::Transformation.rotation(Geom::Point3d.new(0, 0, 0),
                                  Geom::Vector3d.new(0, 0, 1),
                                  angle_rad)
  end

  def self.translate(x, y, z)
    Geom::Transformation.translation(vec(x, y, z))
  end

  # ============================================================
  # MATERIALS
  # ============================================================
  def self.setup_materials(model)
    COLORS.each do |key, c|
      name = "mat_#{key}"
      mat = model.materials[name] || model.materials.add(name)
      mat.color = Sketchup::Color.new(c[0], c[1], c[2])
      mat.alpha = c[3] if c.length == 4
      @materials[key] = mat
    end
  end

  # ============================================================
  # COMPONENTS (defined once, instanced many times)
  # ============================================================
  def self.define_components(model)
    @components[:window]           = define_window_component(model)
    @components[:door_shopfront]   = define_door_shopfront(model)
    @components[:door_residential] = define_door_residential(model)
    @components[:tree]             = define_tree_component(model)
    @components[:balcony]          = define_balcony_component(model)
  end

  # Window: width along +X, height along +Z, depth along +Y.
  # Sill projects in -Y (the "outside") and slightly below z=0.
  def self.define_window_component(model)
    defn = model.definitions.add('comp_window')
    e = defn.entities
    w  = WIN_W
    h  = WIN_H
    fd = WIN_FRAME_D
    ft = 0.06     # frame profile (X/Z)
    mt = 0.05     # mullion profile

    # Stone sill (projects 0.04 m beyond frame on three sides, 0.05 m below)
    box(e, -0.05, -0.04, -0.05, w + 0.10, fd + 0.08, 0.05, @materials[:stone], 'Sill')
    # Outer frame (4 strips)
    box(e, 0,        0, 0,         w,  fd, ft,        @materials[:frame], 'FrameBottom')
    box(e, 0,        0, h - ft,    w,  fd, ft,        @materials[:frame], 'FrameTop')
    box(e, 0,        0, ft,        ft, fd, h - 2*ft,  @materials[:frame], 'FrameLeft')
    box(e, w - ft,   0, ft,        ft, fd, h - 2*ft,  @materials[:frame], 'FrameRight')
    # Mullions (cross-pattern, thinner than frame)
    box(e, w/2 - mt/2, fd*0.25, ft,        mt,        fd*0.5, h - 2*ft, @materials[:frame], 'MullionV')
    box(e, ft,         fd*0.25, h/2 - mt/2, w - 2*ft, fd*0.5, mt,       @materials[:frame], 'MullionH')
    # Glass (single inset pane behind mullions; mullions visually subdivide it)
    box(e, ft, fd*0.45, ft, w - 2*ft, 0.02, h - 2*ft, @materials[:glass], 'Glass')
    defn
  end

  def self.define_door_shopfront(model)
    defn = model.definitions.add('comp_door_shopfront')
    e = defn.entities
    w = DOOR_SHOP_W; h = DOOR_SHOP_H
    ft = 0.08; fd = 0.10
    box(e, 0,      0, 0,        w,  fd, ft,         @materials[:frame], 'Bottom')
    box(e, 0,      0, h - ft,   w,  fd, ft,         @materials[:frame], 'Top')
    box(e, 0,      0, ft,       ft, fd, h - 2*ft,   @materials[:frame], 'Left')
    box(e, w - ft, 0, ft,       ft, fd, h - 2*ft,   @materials[:frame], 'Right')
    # Center mullion (split entrance)
    box(e, w/2 - 0.025, 0, ft, 0.05, fd, h - 2*ft, @materials[:frame], 'Center')
    # Two glass leaves
    leaf_w = (w - 2*ft - 0.05) / 2.0
    box(e, ft,            fd*0.4, ft, leaf_w, 0.02, h - 2*ft, @materials[:glass], 'GlassL')
    box(e, w/2 + 0.025,   fd*0.4, ft, leaf_w, 0.02, h - 2*ft, @materials[:glass], 'GlassR')
    # Push bars (horizontal metal bars, mid-height)
    bar_y = fd + 0.03
    bar_z = 1.05
    box(e, ft + 0.10,         bar_y, bar_z, leaf_w - 0.20, 0.04, 0.04, @materials[:metal], 'BarL')
    box(e, w/2 + 0.025 + 0.10, bar_y, bar_z, leaf_w - 0.20, 0.04, 0.04, @materials[:metal], 'BarR')
    defn
  end

  def self.define_door_residential(model)
    defn = model.definitions.add('comp_door_residential')
    e = defn.entities
    w = DOOR_RES_W; h = DOOR_RES_H
    ft = 0.08; fd = 0.12
    # Stone surround (jambs + lintel)
    box(e, -ft, 0, 0,  ft,         fd, h + ft, @materials[:stone], 'JambL')
    box(e, w,   0, 0,  ft,         fd, h + ft, @materials[:stone], 'JambR')
    box(e, -ft, 0, h,  w + 2*ft,   fd, ft,     @materials[:stone], 'Lintel')
    # Door slab
    box(e, 0, fd*0.30, 0, w, 0.05, h, @materials[:door_wood], 'Slab')
    # Two raised panels
    box(e, 0.10, fd*0.30 + 0.05, 0.30, w - 0.20, 0.015, 0.70, @materials[:door_wood], 'PanelLow')
    box(e, 0.10, fd*0.30 + 0.05, 1.10, w - 0.20, 0.015, 0.70, @materials[:door_wood], 'PanelHigh')
    # Brass handle
    box(e, w - 0.18, fd*0.30 + 0.05, 1.00, 0.06, 0.08, 0.06, @materials[:metal], 'Handle')
    defn
  end

  # Balcony: slab (-z under floor), depth in +Y, glass railing on 3 sides.
  def self.define_balcony_component(model)
    defn = model.definitions.add('comp_balcony')
    e = defn.entities
    w = BALC_W; d = BALC_D; t = BALC_SLAB_T; rh = BALC_RAIL_H
    # Slab (sits 0..-t below the floor level)
    box(e, 0, 0, -t, w, d, t, @materials[:concrete], 'Slab')
    # Posts (corners + mid)
    p = 0.06
    [0, w/2 - p/2, w - p].each do |x|
      box(e, x, d - p, 0, p, p, rh, @materials[:metal], 'PostFront')
    end
    [0, w - p].each do |x|
      box(e, x, 0, 0, p, p, rh, @materials[:metal], 'PostBack')
    end
    # Top rail
    box(e, 0, 0, rh, w, d, 0.05, @materials[:metal], 'TopRail')
    # Glass panels (front + 2 sides)
    box(e, p,    d - p + 0.02, 0.10, w - 2*p, 0.02,    rh - 0.20, @materials[:glass], 'GlassFront')
    box(e, 0,    0,            0.10, 0.02,    d - p,   rh - 0.20, @materials[:glass], 'GlassL')
    box(e, w - 0.02, 0,        0.10, 0.02,    d - p,   rh - 0.20, @materials[:glass], 'GlassR')
    defn
  end

  # Tree: cylindrical trunk + cube canopy (low-poly stand-in for a sphere).
  def self.define_tree_component(model)
    defn = model.definitions.add('comp_tree')
    e = defn.entities
    # Trunk
    tg = e.add_group; tg.name = 'Trunk'
    circle = tg.entities.add_circle(pt(0, 0, 0), Geom::Vector3d.new(0, 0, 1), 0.15.m, 16)
    f = tg.entities.add_face(circle)
    f.reverse! if f.normal.z.to_f < 0
    f.pushpull(2.5.m)
    tg.material = @materials[:trunk]
    # Canopy (a cube high up; foliage colour)
    cs = 1.6
    box(e, -cs/2, -cs/2, 2.3, cs, cs, cs, @materials[:foliage], 'Canopy')
    defn
  end

  # ============================================================
  # SLABS
  # ============================================================
  def self.draw_floor_slabs(parent)
    (0..N_STOREYS).each do |i|
      z = i * STOREY_H
      box(parent.entities, 0, 0, z - SLAB_T, WIDTH, DEPTH, SLAB_T,
          @materials[:concrete], "Slab_L#{i}")
    end
  end

  # ============================================================
  # SITE
  # ============================================================
  def self.draw_site(parent)
    pe = parent.entities
    # Grass plane (large, around and behind building)
    box(pe, -SITE_PAD, -SIDEWALK_D - SITE_PAD/2.0, -0.05,
        WIDTH + 2*SITE_PAD, DEPTH + SITE_PAD + SIDEWALK_D + SITE_PAD/2.0, 0.05,
        @materials[:grass], 'Grass')
    # Sidewalk strip in front of the building
    box(pe, -SITE_PAD/2.0, -SIDEWALK_D, 0.0,
        WIDTH + SITE_PAD, SIDEWALK_D, 0.04,
        @materials[:concrete], 'Sidewalk')
    # Two flanking street trees
    [3.0, WIDTH - 3.0].each do |x|
      tx = translate(x, -SIDEWALK_D / 2.0, 0)
      pe.add_instance(@components[:tree], tx)
    end
  end

  # ============================================================
  # STOREY 1 — RETAIL
  # ============================================================
  def self.draw_retail_storey(parent)
    e = parent.entities
    z = 0.0

    # Brick side walls + back wall
    box(e, 0,                 0,             z, WALL_T,            DEPTH,           STOREY_H, @materials[:brick], 'WallLeft')
    box(e, WIDTH - WALL_T,    0,             z, WALL_T,            DEPTH,           STOREY_H, @materials[:brick], 'WallRight')
    box(e, WALL_T,            DEPTH - WALL_T, z, WIDTH - 2*WALL_T,  WALL_T,          STOREY_H, @materials[:brick], 'WallBack')

    # Shopfront (front) — full glass, mullions, door in centre
    sf_h    = STOREY_H - 0.5            # leaves a 0.5 m sign band at top
    door_x  = (WIDTH - DOOR_SHOP_W) / 2.0
    # Glass to the left of the door
    box(e, WALL_T, 0, z,
        door_x - WALL_T, WALL_T, sf_h, @materials[:glass], 'ShopfrontL')
    # Glass to the right of the door
    box(e, door_x + DOOR_SHOP_W, 0, z,
        WIDTH - WALL_T - (door_x + DOOR_SHOP_W), WALL_T, sf_h, @materials[:glass], 'ShopfrontR')
    # Transom above door (also glass)
    box(e, door_x, 0, z + DOOR_SHOP_H,
        DOOR_SHOP_W, WALL_T, sf_h - DOOR_SHOP_H, @materials[:glass], 'Transom')
    # Sign band across the top (rendered, will be banded by cornice above)
    box(e, 0, 0, z + sf_h, WIDTH, WALL_T + 0.05, STOREY_H - sf_h,
        @materials[:render], 'SignBand')

    # Vertical mullions across the shopfront (skip the door zone)
    n_mul = 5
    (1..n_mul).each do |i|
      mx = i * (WIDTH / (n_mul + 1.0))
      next if (mx - WIDTH/2.0).abs < DOOR_SHOP_W/2.0 + 0.20
      box(e, mx - 0.03, -0.01, z, 0.06, WALL_T + 0.04, sf_h,
          @materials[:frame], "MulV_#{i}")
    end
    # Frame surround (corner posts + bottom rail)
    box(e, 0, -0.01, z, WALL_T,    WALL_T + 0.04, sf_h, @materials[:frame], 'FrameL')
    box(e, WIDTH - WALL_T, -0.01, z, WALL_T, WALL_T + 0.04, sf_h, @materials[:frame], 'FrameR')
    box(e, 0, -0.01, z, WIDTH, WALL_T + 0.04, 0.10, @materials[:frame], 'FrameBottom')

    # Shopfront door
    e.add_instance(@components[:door_shopfront], translate(door_x, 0, z))

    # Back-of-house interior partition
    box(e, WALL_T, DEPTH - 4.0, z,
        WIDTH - 2*WALL_T, 0.10, STOREY_H - 0.4,
        @materials[:render], 'InteriorPartition')
  end

  # ============================================================
  # STOREYS 2..4 — APARTMENTS
  # ============================================================
  def self.draw_apartment_storey(parent, storey_index)
    e = parent.entities
    z = storey_index * STOREY_H

    # Four exterior walls (rendered)
    box(e, 0,                 0,              z, WALL_T,           DEPTH,  STOREY_H, @materials[:render], 'WallLeft')
    box(e, WIDTH - WALL_T,    0,              z, WALL_T,           DEPTH,  STOREY_H, @materials[:render], 'WallRight')
    box(e, WALL_T,            DEPTH - WALL_T, z, WIDTH - 2*WALL_T, WALL_T, STOREY_H, @materials[:render], 'WallBack')
    box(e, WALL_T,            0,              z, WIDTH - 2*WALL_T, WALL_T, STOREY_H, @materials[:render], 'WallFront')

    # ---- Balconies on the front (south, -Y direction) ----
    balc_x_positions = [3.0, WIDTH - 3.0 - BALC_W]
    balc_x_positions.each do |bx|
      e.add_instance(@components[:balcony], translate(bx, -BALC_D, z))
      # Residential door in the wall behind each balcony, centred under the balcony
      door_x = bx + (BALC_W - DOOR_RES_W) / 2.0
      e.add_instance(@components[:door_residential], translate(door_x, 0, z))
    end

    # ---- Front-facade window between the two balconies ----
    front_win_x = WIDTH/2.0 - WIN_W/2.0
    e.add_instance(@components[:window],
                   translate(front_win_x, 0, z + WIN_SILL_Z))

    # ---- Back-facade windows (3, evenly spaced), rotated 180 around Z ----
    back_win_xs = [3.0, WIDTH/2.0 - WIN_W/2.0, WIDTH - 3.0 - WIN_W]
    back_win_xs.each_with_index do |wx, i|
      tx = translate(wx + WIN_W, DEPTH, z + WIN_SILL_Z) * rot_z(Math::PI)
      e.add_instance(@components[:window], tx)
    end

    # ---- Side windows (one per side, mid-floor) ----
    # Left wall (X=0): rotate +90 around Z, sill projects to -X.
    tx_l = translate(0.0, DEPTH/2.0 - WIN_W/2.0, z + WIN_SILL_Z) * rot_z(Math::PI / 2.0)
    e.add_instance(@components[:window], tx_l)
    # Right wall (X=WIDTH): rotate -90 around Z, sill projects to +X.
    tx_r = translate(WIDTH, DEPTH/2.0 + WIN_W/2.0, z + WIN_SILL_Z) * rot_z(-Math::PI / 2.0)
    e.add_instance(@components[:window], tx_r)

    # ---- Interior partitions (two simple stubs per floor) ----
    box(e, WIDTH/3.0,     WALL_T, z, 0.10, DEPTH - 2*WALL_T, STOREY_H - 0.4, @materials[:render], 'PartitionA')
    box(e, 2*WIDTH/3.0,   WALL_T, z, 0.10, DEPTH - 2*WALL_T, STOREY_H - 0.4, @materials[:render], 'PartitionB')
  end

  # ============================================================
  # STAIRWELL (vertical shaft, ground to roof, back-right corner)
  # ============================================================
  def self.draw_stairwell(parent)
    e = parent.entities
    sx = 3.0; sy = 4.0
    bx = WIDTH - sx - WALL_T
    by = WALL_T
    h_total = N_STOREYS * STOREY_H

    # Two interior partition walls (the other two sides reuse the exterior walls)
    box(e, bx,           by + sy,      0, sx,     WALL_T, h_total, @materials[:render], 'StairWallFront')
    box(e, bx,           by,           0, WALL_T, sy,     h_total, @materials[:render], 'StairWallSide')
    # Half-flight landings at each storey
    (0..N_STOREYS).each do |i|
      box(e, bx + WALL_T, by + WALL_T, i * STOREY_H,
          sx - WALL_T, sy - WALL_T, 0.05, @materials[:concrete], "Landing_L#{i}")
    end
    # Stair flight stringers (visual stand-in: a sloped ramp box per flight)
    (0...N_STOREYS).each do |i|
      z0 = i * STOREY_H
      # Ramp: a thin slab tilted manually is complex; use 6 risers as stacked boxes per flight (simplified)
      n_risers = 7
      run     = (sy - 1.0) / n_risers
      rise    = STOREY_H / n_risers
      n_risers.times do |r|
        box(e, bx + WALL_T + 0.20,
               by + WALL_T + 0.5 + r * run,
               z0 + r * rise,
               sx - WALL_T - 0.40, run, rise + 0.02,
               @materials[:concrete], "Step_L#{i}_R#{r}")
      end
    end
  end

  # ============================================================
  # CORNICES (horizontal stone bands at every floor line)
  # ============================================================
  def self.draw_cornices(parent)
    e = parent.entities
    [STOREY_H, 2*STOREY_H, 3*STOREY_H].each do |z|
      # Front
      box(e, -CORNICE_PROJ, -CORNICE_PROJ, z - CORNICE_H/2.0,
          WIDTH + 2*CORNICE_PROJ, CORNICE_PROJ, CORNICE_H,
          @materials[:stone], "CorniceFront_z#{z}")
      # Back
      box(e, -CORNICE_PROJ, DEPTH, z - CORNICE_H/2.0,
          WIDTH + 2*CORNICE_PROJ, CORNICE_PROJ, CORNICE_H,
          @materials[:stone], "CorniceBack_z#{z}")
      # Left
      box(e, -CORNICE_PROJ, 0, z - CORNICE_H/2.0,
          CORNICE_PROJ, DEPTH, CORNICE_H,
          @materials[:stone], "CorniceLeft_z#{z}")
      # Right
      box(e, WIDTH, 0, z - CORNICE_H/2.0,
          CORNICE_PROJ, DEPTH, CORNICE_H,
          @materials[:stone], "CorniceRight_z#{z}")
    end
  end

  # ============================================================
  # PARAPET around roof + stone cap
  # ============================================================
  def self.draw_parapet(parent)
    e = parent.entities
    z = N_STOREYS * STOREY_H
    # 4 walls of parapet
    box(e, 0,                 0,                  z, WIDTH,             PARAPET_T, PARAPET_H, @materials[:render], 'ParapetFront')
    box(e, 0,                 DEPTH - PARAPET_T,  z, WIDTH,             PARAPET_T, PARAPET_H, @materials[:render], 'ParapetBack')
    box(e, 0,                 PARAPET_T,          z, PARAPET_T,         DEPTH - 2*PARAPET_T, PARAPET_H, @materials[:render], 'ParapetLeft')
    box(e, WIDTH - PARAPET_T, PARAPET_T,          z, PARAPET_T,         DEPTH - 2*PARAPET_T, PARAPET_H, @materials[:render], 'ParapetRight')

    # Stone cap (slightly larger than parapet, runs around the perimeter)
    cap_proj = 0.08
    cap_z = z + PARAPET_H
    box(e, -cap_proj, -cap_proj, cap_z,
        WIDTH + 2*cap_proj, PARAPET_T + 2*cap_proj, PARAPET_CAP_T,
        @materials[:stone], 'CapFront')
    box(e, -cap_proj, DEPTH - PARAPET_T - cap_proj, cap_z,
        WIDTH + 2*cap_proj, PARAPET_T + 2*cap_proj, PARAPET_CAP_T,
        @materials[:stone], 'CapBack')
    box(e, -cap_proj, PARAPET_T - cap_proj, cap_z,
        PARAPET_T + 2*cap_proj, DEPTH - 2*PARAPET_T + 2*cap_proj, PARAPET_CAP_T,
        @materials[:stone], 'CapLeft')
    box(e, WIDTH - PARAPET_T - cap_proj, PARAPET_T - cap_proj, cap_z,
        PARAPET_T + 2*cap_proj, DEPTH - 2*PARAPET_T + 2*cap_proj, PARAPET_CAP_T,
        @materials[:stone], 'CapRight')
  end
end

# Auto-run on load
BuildingBuilder.build!
