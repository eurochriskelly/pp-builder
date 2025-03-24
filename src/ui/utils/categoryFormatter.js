function formatCategory(category) {
    if (!category) return '';
    const parts = category.split('_');
    if (parts.length === 2) {
        let part1 = parts[0].toLowerCase();
        let part2 = parts[1].toLowerCase();
        let prefix = '';
        switch(part1) {
            case 'cup':
                prefix = 'CUP - ';
                break;
            case 'shd':
                prefix = 'SHEILD - ';
                break;
            case 'plt':
                prefix = 'PLATE - ';
                break;
            case 'group':
                prefix = 'GROUP';
                break;
            default:
                prefix = part1.toUpperCase() + ' - ';
        }
        if (part2 === 'finals') {
            part2 = 'FINAL';
        } else if (part2 === '3rd4th') {
            part2 = '3/4th';
        } else if (part2 === '4th5th') {
            part2 = '4/5th';
        } else {
            part2 = part2.toUpperCase();
        }
        if (part1 === 'group') {
            return prefix;
        } else {
            return prefix + part2;
        }
    }
    return category.toUpperCase();
}

module.exports = { formatCategory };
