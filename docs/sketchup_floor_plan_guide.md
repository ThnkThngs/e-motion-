# SketchUp Floor Plan Guide

Walkthrough for [`scripts/sketchup_floor_plan.rb`](../scripts/sketchup_floor_plan.rb) — a Ruby script that builds the ground-floor mixed-use plan as 3D walls with door/window openings inside SketchUp Pro.

## Run it

1. Open SketchUp Pro with an empty model.
2. `Window → Ruby Console`.
3. In the console, run:
   ```ruby
   load '/Users/bambangperwitosoteto/vlaude/scripts/sketchup_floor_plan.rb'
   ```
4. On success the console prints `[OK] GroundFloorPlan built — 12 rooms, N unique walls.` and SketchUp zooms to the model.

Re-running after a tweak: `Edit → Undo` (single step — the whole build is wrapped in `model.start_operation`) then `load` again.

## Where the dimensions live

All editable numbers sit at the top of the script in two blocks:

| Block | What it controls |
|-------|------------------|
| `WALL_T`, `WALL_H`, `DOOR_W`, `DOOR_H`, `ENTRY_W`, `WIN_H`, `WIN_SILL`, `SHOP_H`, `LIFT_W`, `LIFT_H` | Global thicknesses and opening sizes (metres). Change `WALL_H` to retest the height. |
| `ROOMS = { ... }` | Per-room geometry. Each entry: `sw: [x, y]` (south-west corner), `size: [w, d]`, and a list of openings. |

Each opening is `{ wall:, u:, w:, sill:, h: }`:
- `wall` — which wall of the room: `:S`, `:N`, `:W`, `:E`.
- `u` — distance from the wall's left edge, measured west-to-east on S/N walls, south-to-north on W/E walls.
- `w` — opening width.
- `sill` — height above floor of the opening bottom. `0` for doors, `WIN_SILL` for typical windows.
- `h` — opening height.

Example — add a window to the north wall of `mail_room`:
```ruby
mail_room: {
  sw: [16.0, 8.4], size: [8.0, 5.0],
  openings: [
    { wall: :S, u: 3.55, w: DOOR_W, sill: 0.0, h: DOOR_H },
    { wall: :N, u: 3.0,  w: 1.2,    sill: WIN_SILL, h: WIN_H },  # new
  ],
},
```

## Swap in real CAD numbers later

When you have the dimensioned plan or DWG export, replace the estimated `sw:` and `size:` values per room. The script reads metres — same unit the plan uses (just divide millimetre dimensions by 1000). Openings stay relative to each room's wall so they re-position automatically when room size changes.

Shared walls between two rooms are automatically deduplicated: whichever room appears first in `ROOMS` "owns" the wall, and openings declared by either side are merged into a single wall with all cut-outs. So if you put a door on the south wall of `pre_lift_lobby` and the matching opening on the north wall of `retail_1`, only one wall is built and both openings cut through it.

## Verify the build

Per the plan's verification checklist:

1. **Outliner** (`Window → Outliner`): expand `GroundFloorPlan`. You should see one `Site` group, one `Labels` group, and 12 named room groups (`retail_1`, `retail_2`, `main_lobby_area`, `main_lift_lobby`, `pre_lift_lobby`, `mail_room`, `male_wc`, `female_wc`, `janitor`, `management_office`, `cold_water_tank`).
2. **Top view** (`Camera → Standard Views → Top`, `Camera → Parallel Projection`): layout should roughly match the source plan — retail strip along the south, lobby/toilets in the middle band, management/tank rooms on the north.
3. **Tape measure** (`T`): measure between the south face of any S-row room and the south face of the management office — should be ~25.85 m (the D-to-H grid span). Between retail 2's west wall and main lobby's east wall: ~48 m.
4. **Iso view** (`Camera → Standard Views → Iso`): walls visibly extrude to 4.4 m. Openings cut cleanly through — orbit around and confirm no internal faces.
5. **Undo test**: `Cmd+Z` (Mac) once — the entire model should disappear in a single step.
6. **Tweak test**: change `WALL_H = 4.40` to `3.00`, undo the previous build, `load` again. Walls rebuild at 3 m.

## Known limits (out of scope per plan)

- No furniture, plumbing fixtures, or lift cabs — openings are voids in walls only.
- No trees, landscape, columns, or RL grade markings from the original plan.
- 3D text labels best-effort: SketchUp's `add_3d_text` needs a system font (`Arial`); on failure the script logs and continues.
- Interior shared walls are 200 mm (single thickness), so the small variation between corridor and room wall thicknesses in the source CAD isn't preserved.

## Files

- [`scripts/sketchup_floor_plan.rb`](../scripts/sketchup_floor_plan.rb) — generator script.
- [`sketchup/building.rb`](../sketchup/building.rb) — unrelated existing 4-storey building generator (same helper style; left untouched).
