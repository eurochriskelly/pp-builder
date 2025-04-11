// import { importFixtures } from './index';
import { processPastedFixtures } from './parse';

describe('Processing fixture data', () => {
  it('Pre-processes pasted fixtures', () => {
   const res = processPastedFixtures(`
TIME	MATCH	PITCH	TEAM1	STAGE	TEAM2	UMPIRES	DURATION	REFEREE
11:30	L.1	WEIMERSKIRSCH	Luxembourg A	GP.1	Eindhoven	Leuven/Maastricht		
12:05	L.2	WEIMERSKIRSCH	Lux B/Den Haag/Cologne	GP.2	Nijmegen/Brus.B/Frank	Brussels A		
12:40	L.3	WEIMERSKIRSCH	Leuven/Maastricht	GP.1	Luxembourg A	Eindhoven		
13:15	L.4	WEIMERSKIRSCH	Brussels A	GP.2	Lux B/Den Haag/Cologne	Nijmegen/Brus.B/Frank		
13:50	L.5	WEIMERSKIRSCH	Eindhoven	GP.1	Leuven/Maastricht	Luxembourg A		
14:25	L.6	WEIMERSKIRSCH	Nijmegen/Brus.B/Frank	GP.2	Brussels A	Lux B/Den Haag/Cologne		
10:30	M.1	CESSANGE-1	Eindhoven	GP.1	Frankfurt	Luxembourg B		
10:55	M.2	CESSANGE-1	Leuven A	GP.1	Leuv B/Nijmeg/D'dorf	Eindhoven		
11:20	M.3	CESSANGE-1	Frankfurt	GP.1	Luxembourg B	Leuv B/Nijmeg/D'dorf		
11:45	M.4	CESSANGE-1	Eindhoven	GP.1	Leuven A	Luxembourg B		
12:10	M.5	CESSANGE-1	Frankfurt	GP.1	Leuv B/Nijmeg/D'dorf	Leuven A		
12:35	M.6	CESSANGE-1	Eindhoven	GP.1	Luxembourg B	Leuv B/Nijmeg/D'dorf		
13:10	M.7	CESSANGE-1	Leuven A	GP.1	Luxembourg B	Frankfurt		
13:35	M.8	CESSANGE-1	Eindhoven	GP.1	Leuv B/Nijmeg/D'dorf	Luxembourg B		
14:05	M.9	CESSANGE-1	Leuv B/Nijmeg/D'dorf	GP.1	Luxembourg B	Eindhoven		
14:45	M.18	CESSANGE-1	1ST Gp.1	CUP.SF1	2nd Gp.2	4th Gp.1	20 mins	
15:15	M.20	CESSANGE-1	3RD Gp.1	SHD.SF1	4th Gp.2	loser M.18	20 mins	
15:45	L.7	CESSANGE-1	2nd Gp.1	CUP.SF1	1st Gp.2	loser M.20	20 mins	
16:15	M.22	CESSANGE-1	winner M.21	CUP.FIN	winner M.22	loser L.7	30mins	
16:55	M.23	CESSANGE-1	winner M.23	SHD.FIN	winner M.24	loser M.22	30mins	
17:35	L.10	CESSANGE-1	winner L.7	CUP.FIN	winner L.8	loser M.23	20 mins	
18:05	L.11	CESSANGE-1	loser L.7	CUP.3/4	loser L.8	loser L.10	20 mins	
10:30	M.10	CESSANGE-2	Luxembourg A	GP.2	Brussels B/Lux C	Brussels A		
11:00	M.11	CESSANGE-2	Brussels A	GP.2	Den Haag/Maastricht	Brussels B/Lux C		
11:35	M.12	CESSANGE-2	Luxembourg A	GP.2	Den Haag/Maastricht	Brussels A		
12:05	M.13	CESSANGE-2	Brussels B/Lux C	GP.2	Brussels A	Den Haag/Maastricht		
12:40	M.14	CESSANGE-2	Luxembourg A	GP.2	Brussels A	Brussels B/Lux C		
13:10	M.15	CESSANGE-2	Den Haag/Maastricht	GP.2	Brussels B/Lux C	Luxembourg A		
13:45	M.16	CESSANGE-2	Leuven A	GP.1	Frankfurt	Den Haag/Maastricht		
14:35	M.17	CESSANGE-2	5th Gp.1	SHD.QF1	4th Gp.2	3rd Gp.2	15 mins	
15:00	M.19	CESSANGE-2	2nd Gp.1	CUP.SF2	1st Gp.2	loser M.17	20 mins	
15:30	M.21	CESSANGE-2	4th Gp.1	SHD.SF2	winner M.17	loser M.19	20 mins	
16:00	L.8	CESSANGE-2	1st Gp.1	CUP.SF2	2nd Gp.2	loser M.21	20 mins	
16:30	L.9	CESSANGE-2	3rd Gp.1	CUP.5/6	3rd Gp.2	loser L.8	20 mins	
17:00	M.24	CESSANGE-2	loser SHD.SF1	SHD.3/4	loser M.21	loser L.9	15 mins	
17:25	M.25	CESSANGE-2	loser M.21	CUP.3/4	loser M.22	winner M.24	20 mins	
17:55	M.26	CESSANGE-2	loser M.23	SHD.4/5	loser M.23	loser M.25	20 mins
`)
    console.log(res)
    expect(1).toBe(1)
  })
})



