import generateImportFixtures from './index.js';

// Sample CSV data
const sampleCSVData = [
  {
    matchId: 1,
    startTime: '09:00',
    pitch: 'Pitch 1',
    stage: 'group',
    category: 'Men A',
    group: '1',
    team1: 'Team A',
    team2: 'Team B',
    umpireTeam: 'Team C',
    duration: '40'
  },
  {
    matchId: 2,
    startTime: '10:00',
    pitch: 'Pitch 2',
    stage: 'group',
    category: 'Men A',
    group: '1',
    team1: 'Team C',
    team2: 'Team D',
    umpireTeam: 'Team A',
    duration: '40'
  },
  {
    matchId: 3,
    startTime: '11:00',
    pitch: 'Pitch 1',
    stage: 'group',
    category: 'Women A',
    group: '1',
    team1: 'Team X',
    team2: 'Team Y',
    umpireTeam: 'Team Z',
    duration: '40'
  }
];

// Validation results
const validationResult = {
  isValid: true,
  warnings: [
    'Team E is not registered in any category',
    'Pitch 3 is not configured for category Women A'
  ],
  props: {
    categories: ['Men A', 'Women A'],
    pitches: ['Pitch 1', 'Pitch 2'],
    groups: {
      byCategory: {
        'Men A': ['1', '2'],
        'Women A': ['1']
      }
    },
    teams: {
      byCategory: {
        'Men A': ['Team A', 'Team B', 'Team C', 'Team D'],
        'Women A': ['Team X', 'Team Y', 'Team Z']
      }
    }
  }
};

// Export the story metadata
export default {
  title: 'Planning/Import Fixtures',
  parameters: {
    layout: 'padded',
  },
};

// Default empty state (Upload CSV selected)
export const Default = {
  render: () => {
    const html = generateImportFixtures(1);
    return html;
  },
};

// Paste Data selected state
export const PasteDataSelected = {
    render: () => {
      let html = generateImportFixtures(1);
      // Simulate selecting the 'paste' radio button and trigger the JS
      html = html.replace('value="upload" \n              checked', 'value="upload"'); // Remove default check from upload
      html = html.replace('value="paste"', 'value="paste" checked'); 
      // Storybook might not run the inline script automatically, 
      // so manually adjust styles for the story preview
      html = html.replace('id="upload-section" class="mb-4"', 'id="upload-section" class="mb-4" style="display: none;"');
      html = html.replace('id="paste-section" class="mb-4" style="display: none;"', 'id="paste-section" class="mb-4" style="display: block;"');
      // Adjust required attributes for story accuracy
      html = html.replace('name="file" accept=".csv" required', 'name="file" accept=".csv"');
      html = html.replace('name="pastedData" rows="10" class="w-full border p-1"', 'name="pastedData" rows="10" class="w-full border p-1" required');
      // Add the paste and clear button structure manually for the story
      html = html.replace(
        '<label for="pastedData" class="block mb-1">Paste your spreadsheet fixtures here:</label>',
        `<div class="flex justify-between items-center mb-1">
             <label for="pastedData" class="block font-medium">Paste your spreadsheet fixtures here:</label>
             <div class="space-x-2">
                 <button 
                    type="button" 
                    onclick="pasteFromClipboard()" 
                    class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                 >
                    Paste from Clipboard
                 </button>
                 <button 
                    type="button" 
                    onclick="clearPastedData()" 
                    class="text-sm bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded"
                 >
                    Clear
                 </button>
             </div>
          </div>`
      );
      return html;
    },
  };

// With CSV data loaded (after upload/paste and processing)
export const WithCSVData = {
  render: () => {
    const html = generateImportFixtures(1, sampleCSVData);
    return html;
  },
};

// With validation results
export const WithValidation = {
  render: () => {
    const modifiedResult = {
      ...validationResult,
      isValid: false // Force showing warnings
    };
    const html = generateImportFixtures(1, sampleCSVData, modifiedResult);
    // Remove the validate button from the HTML
    return html.replace(
      '<form hx-post="/planning/1/validate-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" class="mb-4">',
      ''
    ).replace(
      '<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Validate</button>', 
      ''
    ).replace(
      '</form>', 
      ''
    ).replace( // Remove the initial form elements as they are replaced by the results
        /<form id="import-form"[^>]*>[\s\S]*?<\/form>/, 
        ''
      ).replace( // Remove the script tag as well
        /<script>[\s\S]*?<\/script>/,
        ''
      );
  },
};

// With valid data ready to import
export const ValidData = {
  render: () => {
    const validResult = {
      ...validationResult,
      warnings: []
    };
    let html = generateImportFixtures(1, sampleCSVData, validResult);
     // Remove the initial form elements as they are replaced by the results
     html = html.replace(/<form id="import-form"[^>]*>[\s\S]*?<\/form>/, '');
     // Remove the script tag as well
     html = html.replace(/<script>[\s\S]*?<\/script>/, '');
    return html;
  },
};
