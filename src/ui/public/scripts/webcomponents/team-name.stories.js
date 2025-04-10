import './team-name.js';
import './logo-box.js';

export default {
    title: 'Components/TeamName',
    component: 'team-name',
    argTypes: {
        name: { control: 'text', description: 'Team name, can include slashes' },
        showLogo: { control: 'boolean', description: 'Whether to show the logo' },
        height: { control: 'text', description: 'Height of the logo and component (e.g., "30px")' },
        direction: {
            control: { type: 'radio' },
            options: ['l2r', 'r2l'],
            description: 'Direction of layout: left-to-right or right-to-left',
        },
        completion: {
            control: { type: 'number', min: 1, max: 3, step: 1 },
            description: 'Spacing level (1-3)',
        },
        maxchars: {
            control: { type: 'number' },
            description: 'Max characters before truncation',
        }
    },
};

const Template = ({ name, showLogo, height }) => {
    const element = document.createElement('team-name');
    element.setAttribute('name', name);
    element.setAttribute('showLogo', showLogo.toString());
    if (height) element.setAttribute('height', height);
    return element;
};

const MultiTemplate = ({ teams }) => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.width = '300px';
    teams.forEach(({ name, showLogo, height, direction, completion, maxchars }) => {
        const element = document.createElement('team-name');
        element.setAttribute('name', name);
        element.setAttribute('showLogo', showLogo.toString());
        if (height) element.setAttribute('height', height);
        if (direction) element.setAttribute('direction', direction);
        if (completion) element.setAttribute('completion', completion);
        if (maxchars) element.setAttribute('maxchars', maxchars);
        container.appendChild(element);
    });
    return container;
};

export const Default = Template.bind({});
Default.args = { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px' };
Default.storyName = 'Default with Logo';

export const NoLogo = Template.bind({});
NoLogo.args = { name: 'Manchester United', showLogo: false, height: '30px' };
NoLogo.storyName = 'Without Logo';

export const WithSlash = Template.bind({});
WithSlash.args = { name: 'Foo/Bar United', showLogo: true, height: '40px' };
WithSlash.storyName = 'With Slash';

export const MultipleTeamsOrder1 = MultiTemplate.bind({});
MultipleTeamsOrder1.args = {
    teams: [
        { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px', maxchars: '20' },
        { name: 'Manchester United', showLogo: true, height: '30px', completion: 2 },
        { name: 'Chelsea/London F.C.', showLogo: true, height: '30px', maxchars: '15', completion: 3 },
        { name: 'Arsenal F.C.', showLogo: true, height: '30px' },
        { name: 'Arsenal F.C.', direction: 'r2l', showLogo: true, height: '30px', completion: 2 },
        { name: 'Foo/Bar United', showLogo: true, height: '30px', maxchars: '10', direction: 'r2l', completion: 3 },
    ],
};
MultipleTeamsOrder1.storyName = 'Multiple Teams (Order 1)';

export const MultipleTeamsOrder2 = MultiTemplate.bind({});
MultipleTeamsOrder2.args = {
    teams: [
        { name: 'Foo/Bar United', showLogo: true, height: '30px' },
        { name: 'Arsenal F.C.', showLogo: true, height: '30px' },
        { name: 'Chelsea/London F.C.', showLogo: true, height: '30px' },
        { name: 'Manchester United', showLogo: true, height: '30px' },
        { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px' },
    ],
};
MultipleTeamsOrder2.storyName = 'Multiple Teams (Order 2 - Shuffled)';

export const SpacingDebug = MultiTemplate.bind({});
SpacingDebug.args = {
    teams: [
        { name: 'Team 1', showLogo: true, height: '30px', completion: 1 },
        { name: 'Team 2', showLogo: true, height: '30px', completion: 2 },
        { name: 'Team 3', showLogo: true, height: '30px', completion: 3 },
        { name: 'Team 4', showLogo: true, height: '30px', direction: 'r2l', completion: 1 },
        { name: 'Team 5', showLogo: true, height: '30px', direction: 'r2l', completion: 2 },
        { name: 'Team 6', showLogo: true, height: '30px', direction: 'r2l', completion: 3 },
    ],
};
SpacingDebug.storyName = 'Spacing Debug (Visible Spacers)';

export const EdgeCases = MultiTemplate.bind({});
EdgeCases.args = {
    teams: [
        { name: 'Very Long Team Name That Should Be Truncated', showLogo: true, height: '30px', completion: 3, maxchars: 20 },
        { name: 'Short', showLogo: true, height: '30px', completion: 3 },
        { name: 'Team With/Slash', showLogo: true, height: '30px', completion: 2 },
        { name: 'No Logo Team', showLogo: false, height: '30px', completion: 3 },
    ],
};
EdgeCases.storyName = 'Edge Cases with Completion';
