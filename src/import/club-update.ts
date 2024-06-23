type TeamTypes = 'gaa' | 'lgfa' | 'hurling' | 'camogie' | 'handball' | 'rounders' | 'youthfootball' | 'youthhurling';

interface IClub {
  clubId: number,
  isStudent: boolean;
  clubName: string;
  founded: number|null;
  affiliated: number|null;
  deactivated: number|null;
  country: string;
  city: string;
  region: string;
  subregion: string|null;
  status: string;
  domain: string;
}

interface IClubTeam {
  clubId: string,
  teamName: string,
  category: TeamTypes,
  foundedYear: number,
  status: string,
  contactEmail: string
}

export const generateTeamInsertStatement = (team: IClubTeam) => {
    const query = `
        INSERT INTO clubTeams (clubId, teamName, category, foundedYear, status, contactEmail)
        VALUES (${team.clubId}, '${team.teamName}', '${team.category}', ${team.foundedYear}, '${team.status}', ${team.contactEmail}');
    `;
    return query;
}

export const generateClubInsertStatement = (club: IClub) => {
    const query = `
        INSERT INTO clubs (
            clubId, isStudent, clubName, founded, affiliated, deactivated,
            country, city, region, subregion, status, domain
        ) VALUES (
            club.clubId, '${club.isStudent}', '${club.clubName}', 
            ${club.founded ? club.founded : 'NULL'}, ${club.affiliated ? club.affiliated : 'NULL'},
            ${club.deactivated ? club.deactivated : 'NULL'},
            '${club.country}', '${club.city}',
            '${club.region}', '${club.subregion}', '${club.status}', '${club.domain}'
        );
    `;
    return query;
}

