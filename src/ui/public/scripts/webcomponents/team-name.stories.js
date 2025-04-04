import './team-name.js';
import './logo-box.js';

export default {
    title: 'Components/TeamName',
    component: 'team-name',
    argTypes: {
        name: { control: 'text', description: 'Team name, can include slashes' },
        showLogo: { control: 'boolean', description: 'Whether to show the logo' },
        height: { control: 'text', description: 'Height of the logo and component (e.g., "30px")' },
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

    teams.forEach(({ name, showLogo, height }) => {
        const element = document.createElement('team-name');
        element.setAttribute('name', name);
        element.setAttribute('showLogo', showLogo.toString());
        if (height) element.setAttribute('height', height);
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
        { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px' },
        { name: 'Manchester United', showLogo: true, height: '30px' },
        { name: 'Chelsea/London F.C.', showLogo: true, height: '30px' },
        { name: 'Arsenal F.C.', showLogo: true, height: '30px' },
        { name: 'Foo/Bar United', showLogo: true, height: '30px' },
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
