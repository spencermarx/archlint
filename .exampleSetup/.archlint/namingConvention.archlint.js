/**
 * @fileoverview - Configuration for namingConvention Rule
 * @description - This config should be placed in a folder `.archlint`
 * @required - Only if `.archlintrc.js` has `namingConvention` enabled
 * @author - Spencer Marx
 */

module.exports = {
  // Name of rule
  rule: 'namingConvention',

  // The root-level folders to carry out serarches within
  includedRootFolders: [
    'components-rework',
    'globals'
  ],
  // Naming Convention with Standard Fields
  conventions: [
    {
      // Name of Convention
      name: 'Helpers',

      // Describe the convention
      description: 'Checks for helper file naming',

      // Folder names to look within (within Root Level Folders)
      targetParentDir: {
        dirName: 'helpers',
        relation: 'parent'
      },

      /**
       * @description - Desired Naming Convention as Regex String
       * @instance - We will follow the the molecular-based '<name>.helper.js' convention
       * @note - One must escape JS strings with \\ to prep for Regex Object Creation
       */
      expectedName: {
        body: '\\/([a-z].*)\\.helper',
        extension: '\\.js'
      } ,

      // Error message to display if failed
      errorMessage: 'Please follow the standard <name>.helper.js standard for naming helpers'
    },
    {
        // Name of rule
      name: 'Vue',

      // Describe the convention
      description: 'Checks for vue file naming',

      // Folder names to look within
      targetParentDir: {
        dirName: 'components',
        relation: 'parent'
      },

      /**
       * @description - Desired Naming Convention as Regex String
       * @instance - We will follow the kebab-case naming convention
       * @note - One must escape JS strings with \\ to prep for Regex Object Creation
       */
      expectedName: {
        body: '\\/([a-z][a-z0-9]*)(-[a-z0-9]+)*',
        extension: '\\.vue'
      },

      // Error message to display if failed
      errorMessage: 'Please follow the standard <kebab>-<case>.vue standard for naming Vue Components'
    }
  ],
}