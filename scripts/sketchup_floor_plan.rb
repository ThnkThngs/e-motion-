# encoding: UTF-8
# sketchup_floor_plan.rb — Ground-floor mixed-use floor plan generator.
#
# Built from the provided architectural plan: lift lobby, retail, main lobby,
# management office, mail room, toilets, cold-water-tank room, alfresco, and
# apartment drop-off. Dimensions estimated from the visible structural grid
# (D-E = 9050, E-F = F-H = 8400 mm; horizontal bays ~6000 mm).
#
# Run inside SketchUp Pro:
#   Window -> Ruby Console
#   load '/Users/bambangperwitosoteto/vlaude/scripts/sketchup_floor_plan.rb'
#
# Re-run after Edit -> Undo to apply CONFIG changes.

module FloorPlanBuilder
  # ============================================================
  # CONFIG  (edit these — everything else flows from them)
  # ============================================================
  WALL_T       = 0.20    # wall thickness (m)
  WALL_H       = 4.40    # clear height — 4.4 m per plan note
  DOOR_W       = 0.90
  DOOR_H       = 2.10
  ENTRY_W      = 2.40    # main lobby entry double-door width
  ENTRY_H      = 2.40
  WIN_H        = 1.50
  WIN_SILL     = 0.90
  SHOP_H       = 3.00    # shopfront glazing height (sill = 0)
  LIFT_W       = 1.10
  LIFT_H       = 2.20

  # Materials (RGB or RGBA)
  COLORS = {
    wall:     [225, 220, 210],
    glass:    [166, 205, 232, 0.35],
    door:     [ 92,  58,  33],
    metal:    [136, 136, 136],
    slab:     [191, 191, 191],
    paving:   [170, 165, 155],
    grass:    [111, 168,  75],
    label:    [ 40,  40,  40],
  }

  # ============================================================
  # ROOMS — SW corner [x, y] + size [w_x, d_y], all in metres.
  #
  # Openings: list of { wall:, u:, w:, sill:, h: } where
  #   wall = :S | :N | :W | :E
  #   u    = distance along that wall from its left edge (in plan)
  #          (S/N walls: measured west-to-east; W/E walls: south-to-north)
  #   w    = opening width
  #   sill = floor-to-opening-bottom (0 for doors)
  #   h    = opening height
  # ============================================================
  ROOMS = {
    retail_2: {
      sw: [0.0, 0.0], size: [10.0, 8.4],
      openings: [
        { wall: :S, u: 1.0, w: 8.0, sill: 0.0, h: SHOP_H },           # shopfront
      ],
    },
    retail_1: {
      sw: [10.0, 0.0], size: [18.0, 8.4],
      openings: [
        { wall: :S, u: 2.0, w: 14.0, sill: 0.0, h: SHOP_H },          # shopfront
      ],
    },
    main_lobby_area: {
      sw: [28.0, 0.0], size: [20.0, 8.4],
      openings: [
        { wall: :S, u: 1.0, w: 6.0, sill: 0.0, h: SHOP_H },           # glazing L
        { wall: :S, u: 9.0, w: ENTRY_W, sill: 0.0, h: ENTRY_H },      # entry door
        { wall: :S, u: 13.0, w: 6.0, sill: 0.0, h: SHOP_H },          # glazing R
      ],
    },
    main_lift_lobby: {
      sw: [0.0, 8.4], size: [10.0, 8.4],
      openings: [
        { wall: :W, u: 0.9, w: LIFT_W, sill: 0.0, h: LIFT_H },        # lift 1
        { wall: :W, u: 2.6, w: LIFT_W, sill: 0.0, h: LIFT_H },        # lift 2
        { wall: :W, u: 4.3, w: LIFT_W, sill: 0.0, h: LIFT_H },        # lift 3
        { wall: :W, u: 6.0, w: LIFT_W, sill: 0.0, h: LIFT_H },        # lift 4
        { wall: :S, u: 4.55, w: 1.5, sill: 0.0, h: DOOR_H },          # to lobby
      ],
    },
    pre_lift_lobby: {
      sw: [10.0, 8.4], size: [6.0, 5.0],
      openings: [
        { wall: :S, u: 2.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
    mail_room: {
      sw: [16.0, 8.4], size: [8.0, 5.0],
      openings: [
        { wall: :S, u: 3.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
    male_wc: {
      sw: [24.0, 8.4], size: [6.0, 5.0],
      openings: [
        { wall: :S, u: 2.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
    female_wc: {
      sw: [24.0, 13.4], size: [6.0, 3.4],
      openings: [
        { wall: :S, u: 2.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
    janitor: {
      sw: [30.0, 8.4], size: [2.0, 2.0],
      openings: [
        { wall: :S, u: 0.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
    management_office: {
      sw: [0.0, 16.8], size: [8.0, 9.05],
      openings: [
        { wall: :S, u: 3.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
        { wall: :N, u: 3.25, w: 1.5,    sill: WIN_SILL, h: WIN_H },
      ],
    },
    cold_water_tank: {
      sw: [16.0, 16.8], size: [12.0, 9.05],
      openings: [
        { wall: :S, u: 5.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
      ],
    },
  }

  FOOTPRINT_X0 = -1.0
  FOOTPRINT_Y0 = -5.0
  FOOTPRINT_W  = 50.0
  FOOTPRINT_D  = 32.0
  ALFRESCO_X0  = 0.0
  ALFRESCO_Y0  = -4.0
  ALFRESCO_W   = 48.0
  ALFRESCO_D   = 4.0

  @materials = {}

  # ============================================================
  # ENTRY
  # ============================================================
  def self.build!
    model = Sketchup.active_model
    model.start_operation('Build Floor Plan', true)
    begin
      setup_materials(model)

      root = model.entities.add_group
      root.name = 'GroundFloorPlan'

      # Floor slab + alfresco paving (under everything)
      site = root.entities.add_group; site.name = 'Site'
      box(site.entities, FOOTPRINT_X0, FOOTPRINT_Y0 - 1.0, -0.05,
          FOOTPRINT_W + 4.0, FOOTPRINT_D + 4.0, 0.05,
          @materials[:grass], 'Grass')
      box(site.entities, FOOTPRINT_X0, FOOTPRINT_Y0, -0.20,
          FOOTPRINT_W, FOOTPRINT_D, 0.20,
          @materials[:slab], 'FloorSlab')
      box(site.entities, ALFRESCO_X0, ALFRESCO_Y0, -0.05,
          ALFRESCO_W, ALFRESCO_D, 0.05,
          @materials[:paving], 'AlfrescoPaving')

      # Consolidate walls by line (axis, v): every room's side that touches
      # the same line contributes its u-span and openings. We then take the
      # interval union of spans and emit one wall per disjoint segment with
      # all relevant openings merged in. This prevents a longer adjacent
      # wall from covering a smaller room's doorway.
      lines = {}
      ROOMS.each do |_room_name, rdef|
        sx, sy = rdef[:sw]
        w_room, d_room = rdef[:size]
        sides = {
          S: [:x, sx,         sx + w_room, sy],
          N: [:x, sx,         sx + w_room, sy + d_room],
          W: [:y, sy,         sy + d_room, sx],
          E: [:y, sy,         sy + d_room, sx + w_room],
        }
        sides.each do |side, (axis, u0, u1, v)|
          key = "#{axis}|#{v.round(4)}"
          line = (lines[key] ||= { axis: axis, v: v, spans: [], openings: [] })
          line[:spans] << [u0, u1]
          (rdef[:openings] || []).each do |op|
            next unless op[:wall] == side
            line[:openings] << {
              u: u0 + op[:u], w: op[:w],
              sill: op[:sill] || 0.0, h: op[:h],
            }
          end
        end
      end

      walls_root = root.entities.add_group
      walls_root.name = 'Walls'
      n_segments = 0
      lines.each_value do |line|
        merge_intervals(line[:spans]).each do |u0, u1|
          # Pick openings whose midpoint falls inside this disjoint segment
          seg_ops = line[:openings].select do |op|
            mid = op[:u] + op[:w] / 2.0
            mid >= u0 && mid <= u1
          end
          # Translate opening u from world coords to local (offset from u0)
          local_ops = seg_ops.map { |op| op.merge(u: op[:u] - u0) }
          seg_name = "wall_#{line[:axis]}_v#{line[:v].round(2)}_u#{u0.round(2)}-#{u1.round(2)}"
          add_wall_segments(
            walls_root,
            axis: line[:axis], u0: u0, u1: u1, v: line[:v],
            height: WALL_H, thickness: WALL_T,
            openings: local_ops,
            material: @materials[:wall],
            name: seg_name,
          )
          n_segments += 1
        end
      end

      # 3D text labels (best-effort — skip silently if font unavailable)
      labels = root.entities.add_group
      labels.name = 'Labels'
      ROOMS.each do |name, rdef|
        sx, sy = rdef[:sw]
        w_room, d_room = rdef[:size]
        add_label(labels.entities,
                  name.to_s.tr('_', ' ').upcase,
                  sx + w_room / 2.0, sy + d_room / 2.0, 1.2)
      end

      model.active_view.zoom_extents
      model.commit_operation
      puts "[OK] GroundFloorPlan built — #{ROOMS.size} rooms, #{walls.size} unique walls."
    rescue => err
      model.abort_operation
      puts "[FAIL] #{err.class}: #{err.message}"
      puts err.backtrace.first(15).join("\n")
      raise
    end
  end

  # ============================================================
  # WALL SEGMENT BUILDER
  # ============================================================
  # Builds a wall along an axis-aligned line as a series of solid columns,
  # skipping rectangular cut-outs for doors/windows. No boolean ops needed.
  #
  # axis:      :x (wall runs east-west) or :y (wall runs north-south)
  # u0, u1:    start/end along the wall axis (metres, world coords)
  # v:         perpendicular coordinate (centerline of the wall)
  # height:    wall height
  # thickness: wall thickness (centered on v)
  # openings:  array of { u:, w:, sill:, h: }, u measured from u0
  def self.add_wall_segments(parent, axis:, u0:, u1:, v:, height:, thickness:,
                              openings: [], material: nil, name: 'Wall')
    g = parent.entities.add_group
    g.name = name
    t = thickness
    ents = g.entities

    emit = lambda do |a, b, z0, z1|
      next if (b - a) <= 0.001 || (z1 - z0) <= 0.001
      if axis == :x
        box(ents, a, v - t / 2.0, z0, b - a, t, z1 - z0, material, nil)
      else
        box(ents, v - t / 2.0, a, z0, t, b - a, z1 - z0, material, nil)
      end
    end

    cur = u0
    ops = openings.sort_by { |o| o[:u] }
    ops.each do |op|
      a = u0 + op[:u]
      b = a + op[:w]
      next if b <= u0 || a >= u1                 # opening outside wall extents
      a = [a, u0].max
      b = [b, u1].min
      sill = op[:sill] || 0.0
      top  = sill + op[:h]

      emit.call(cur, a, 0.0, height) if a > cur
      emit.call(a, b, 0.0, sill) if sill > 0.0
      emit.call(a, b, top, height) if top < height
      cur = b
    end
    emit.call(cur, u1, 0.0, height) if cur < u1

    g
  end

  # ============================================================
  # HELPERS — same style as sketchup/building.rb
  # ============================================================
  def self.pt(x, y, z)
    Geom::Point3d.new(x.m, y.m, z.m)
  end

  # Axis-aligned box as its own sub-group (won't merge with siblings).
  def self.box(parent_ents, x, y, z, sx, sy, sz, material = nil, name = nil)
    g = parent_ents.add_group
    g.name = name if name
    p1 = pt(x,      y,      z)
    p2 = pt(x + sx, y,      z)
    p3 = pt(x + sx, y + sy, z)
    p4 = pt(x,      y + sy, z)
    f = g.entities.add_face(p1, p2, p3, p4)
    f.reverse! if f.normal.z.to_f < 0
    f.pushpull(sz.m)
    g.material = material if material
    g
  end

  def self.wall_key(axis, u0, u1, v)
    a = [u0, u1].min
    b = [u0, u1].max
    "#{axis}|#{a.round(4)}|#{b.round(4)}|#{v.round(4)}"
  end

  def self.setup_materials(model)
    COLORS.each do |key, c|
      mat = model.materials["mat_fp_#{key}"] || model.materials.add("mat_fp_#{key}")
      mat.color = Sketchup::Color.new(c[0], c[1], c[2])
      mat.alpha = c[3] if c.length == 4
      @materials[key] = mat
    end
  end

  # Best-effort 3D text label. SketchUp's add_3d_text needs a font that
  # exists on the local machine; if it fails, log and skip.
  def self.add_label(ents, text, cx, cy, z)
    tgroup = ents.add_group
    tgroup.name = "label_#{text}"
    begin
      tgroup.entities.add_3d_text(
        text, TextAlignCenter, 'Arial',
        false, false,                             # bold, italic
        0.30.m,                                   # letter height (30 cm)
        0.0,                                      # tolerance
        z.m,                                      # baseline z
        true,                                     # filled
        0.02.m                                    # extrusion depth
      )
      # Centre at (cx, cy): add_3d_text starts the baseline at origin and
      # extends in +X; nudge the group to centre on the room.
      tx = Geom::Transformation.translation(
        Geom::Vector3d.new(cx.m, cy.m, 0))
      tgroup.transform!(tx)
      tgroup.material = @materials[:label]
    rescue => e
      puts "[WARN] label '#{text}' skipped: #{e.message}"
      tgroup.erase! if tgroup.valid?
    end
    tgroup
  end
end

# Auto-run on load
FloorPlanBuilder.build!
