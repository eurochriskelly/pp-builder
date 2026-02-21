# The Allocator

The Allocator must handle distributing fixtures to different pitches based on
order and availability.

Each pitch has an availability array. This could be periods of time when the
pitch is available. Pitches must be fully staffed to be considered usable. At a
minimum, this means having referrees available to man the pitch, but strictly
speaking, it also requires umpires and field coordindators.

## Example

An example 2 pitch situation. Match durations for groups of size 3 are
14 minute per half. For a group of 4, the duration is 7 minutes per
half. The matches should be scheduled in each pitch to maximize pitch
utilization. For simplicity, we'll disregard breaks and slack and
assume G4 matches are 15 minutes apart and G3 matches are 30 minutes
apart.

### Match order

| Size | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----|----|----|----|----|----|
| 4    | A1 | A2 | A3 | A4 | A5 | A6 |
| 3    | B1 | B2 | B3 |    |    |    |
| 3    | C1 | C2 | C3 |    |    |    |

### Idealized match order

What is the match order if each group had it's own pitch? This is the
order in which available slots should be assigned and in the above
case it looks something like this:

| 10:00 | A1 | B1 | C1 |
| 10:15 | A2 |    |    |
| 10:30 | A3 | B2 | C2 |
| 10:45 | A4 |    |    |
| 11:00 | A5 | B3 | C3 |
| 11:15 | A6 |    |    |

### Likely schedule

| time  | match |   | time  | match |
|-------|-------|---|-------|-------|
| 10:00 | A1    |   | 10:00 | B1    |
| 10:15 | C1    |   | 10:30 | A2    |
| 10:45 | A3    |   | 10:45 | B2    |
| 11:00 | C2    |   | 11:15 | A4    |
| 11:30 | A5    |   | 11:30 | B3    |
| 11:45 | C3    |   | 12:00 | A6    |

