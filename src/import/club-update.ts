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
  domain: string|null;
}

interface IClubTeam {
  clubId: number,
  teamName: string|null,
  category: TeamTypes,
  foundedYear: number|null,
  status: string,
  contactEmail: string|null
}

export const generateClubInsertStatement = (club: IClub) => {
    const query = `
        INSERT INTO clubs (
            clubId, isStudent, clubName, founded, affiliated, deactivated,
            country, city, region, subregion, status, domain
        ) VALUES (
            ${club.clubId}, 
            ${club.isStudent},
            "${club.clubName}",
            ${club.founded ? club.founded : 'NULL'}, 
            ${club.affiliated ? club.affiliated : 'NULL'},
            ${club.deactivated ? club.deactivated : 'NULL'},
            '${club.country}', '${club.city}',
            '${club.region}', ${club.subregion ? `'${club.subregion}'` : 'NULL'}, '${club.status}', ${club.domain ? `'${club.domain}'` : 'NULL' }
        );
    `;
    return query;
}

export const generateTeamInsertStatement = (team: IClubTeam) => {
    const query = `
        INSERT INTO clubTeams (clubId, teamName, category, foundedYear, status, contactEmail)
        VALUES (
          ${team.clubId}, ${team.teamName || 'NULL'}, 
          '${team.category}',
          ${team.foundedYear ? team.foundedYear : 'NULL'},
          '${team.status}', ${team.contactEmail || 'NULL'}
        );
    `;
    return query;
}

