# Knockout stage

The knock out stage is organized based on the rules defined in the brackets
section of the tournament document. Knockouts stages are calculated per
category. For example, in a tournamnent with Mens and Ladies categories, the
knockout stages are calculated separately for each category and the rules are
defined in the brackets section of the tournament.

A knockout bracket will typically involve semi-finals plus finals for the top
team in a each group in a competition with 4 groups, or a semi-finals and finals
for the top 2 teams in a competition with 2 groups. The number of teams in the
knockout stage is determined by the number of teams in the competition and the
rules defined in the brackets section of the tournament. 

## Bracket rules

Generally speaking, based on seeding, and on-average, larger group sizes, the
lower number group should be most difficult and highest number group least
difficult. Given the following final group standings for a competion:

    | POS | GROUP 1 | GROUP 2 | GROUP 3 | GROUP 4 |
    |-----|---------|---------|---------|---------|
    | 1   | Team 1  | Team 2  | Team 3  | Team 4  |
    | 2   | Team 5  | Team 6  | Team 7  | Team 8  |
    | ... | ...     | ...     | ...     | ...     |
    | 3   | Team 9  | Team 10 | Team 11 | Team 12 |

... a 4-team bracket will look like this:

      Team 1 -+
              |
              +-> ? -+
              |      |
      Team 3 -+      |
                     +-> ? Winner
                     |
      Team 2 -+      |
              |      |
              +-> ? -+
              |      
      Team 4 -+

... and an 8-team bracket will look like this:

      Team 1 -+
              |
              +-> ? -+
              |      |
      Team 8 -+      |
                     +-> ? -+
                     |      |
      Team 3 -+      |      |
              |      |      |
              +-> ? -+      |
              |             |
      Team 6 -+             |
                            +-> ? Winner
      Team 2 -+             |
              |             |
              +-> ? -+      |
              |      |      |
      Team 7 -+      |      |
                     +-> ? -+
                     |
      Team 4 -+      |
              |      |
              +-> ? -+
              |
      Team 5 -+

If there are fewer than 8 teams to fill the bracket, the teams from the toughest
groups will benefit by automatically advancing to the next round. More than 8
teams is not possible since this will lead to a new bracket (e.g. "spoon").

The above rules work well for power of 2 numbers of teams and lead to very clear
rules. This is so simple it can even be hard-coded.

## Examples

Given a definition as follows:

divisions {
    cup: 4,
    plate: 4,
    bowl: null
}

The knockout divisions will be ordered "cup", "plate", "bowl", the cup will take
in the top 4 teams, the plate will take in the next 4 teams and the bowl will
take in the rest of the teams.

Teams should not play another team in the same group in the knockout stage until
the final if possible. Using the default rules, the number of teams will be a
power of 2 and all but the last division must choose a power of 2 number of
teams. The last division will take the remaining teams.

### Example 1: 4 groups of 3/4 teams

Give the following group result for a 13 team competitions:

| POS | GROUP 1 | GROUP 2 | GROUP 3 | GROUP 4 |
|-----|---------|---------|---------|---------|
| 1   | Team 3  | Team 6  | Team 9  | Team 11 |
| 2   | Team 1  | Team 5  | Team 10 | Team 13 |
| 3   | Team 4  | Team 7  | Team 8  | Team 12 |
| 4   | Team 2  |         |         |         |


The first place team in groups 1-4 will be selected for the cup. The second
place team in groups 1-4 will be selected for the plate. The third and fourth
place team in groups 1-4 will be selected for the bowl. 

To decide who plays who in the knockout stage we first must determine the
overall order of teams in the competition as if they all played in one large
group. If groups are not balanced, the teams in the larger groups will have
their points and goal difference adjusted to reflect the average points and goal
difference of the smaller groups. Goal difference will be adjusted based on
number of games played as well as the playing time per game which is different
depending on the size of the group. If 2 teams have the same points, points
scored, and points difference making it impossible to determine the order, the
order will be randomly determined and the decision to do so will be logged for
audit purposes. 


In the above example, the knockout table should look as follows:

    CUP:

      Team 3 -+
              |
              +-> ? -+
              |      |
      Team 9 -+      |
                     +-> ? Winner
                     |
      Team 6 -+      |
              |      |
              +-> ? -+
              |
     Team 11 -+


    PLATE:

      Team 1 -+
              |
              +-> ? -+
              |      |
      Team 5 -+      |
                     +-> ? Winner
                     |
     Team 10 -+      |
              |      |
              +-> ? -+
              |
     Team 13 -+


    BOWL:

             Team 4 -+
                     |
                     +-> ? -+
                     |      |
             Team 7 -+      |
                            +-> ? Winner
                            |
             Team 8 -+      |
                     |      |
                     +-> ? -+
                     |
     Team 10 -+      |
              |      |
              +-> ? -+
              |
     Team 13 -+

# Example 2: 2 groups of 5/4 teams

Given the following group result for a 9 team competition:

| POS | GROUP 1 | GROUP 2 |
|-----|---------|---------|
| 1   | Team 2  | Team 8  |
| 2   | Team 5  | Team 7  |
| 3   | Team 1  | Team 6  |
| 4   | Team 4  | Team 9  |
| 5   | Team 3  |         |

Applying similar logic as in the previous example, the knockout table should look as follows:

    CUP:

      Team 2 -+
              |
              +-> ? -+
              |      |
      Team 8 -+      |
                     +-> ? Winner
                     |
      Team 5 -+      |
              |      |
              +-> ? -+
              |
      Team 7 -+

    PLATE:

             Team 4 -+
                     |
                     +-> ? -+
                     |      |
             Team 7 -+      |
                            +-> ? Winner
                            |
             Team 8 -+      |
                     |      |
                     +-> ? -+
                     |
     Team 10 -+      |
              |      |
              +-> ? -+
              |
     Team 13 -+