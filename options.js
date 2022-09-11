/**
 * Options {Class} - defines state of RuleSet.
 * rs {object} - defines set of rules
 * selectedOptions {Set} - represents set of selected options
 */
class Options {

    constructor(rs) {
        this.rs = rs;
        this.selectedOptions = new Set();
    }

    /**
      * This function returns selected options
      * @returns {Set} selectedOptions
      */
    getSelection() {
        return Array.from(this.selectedOptions);
    }


    /**
      * This function is used to toggle options. Options are either selected or deselected based on defined ruleSet by using DFS.
      * @param {string} option - option to toggle
      */
    toggle(option) {
        if (!this.selectedOptions.has(option)) {
            const traversedPath = this.rs.dfs(this.rs.dependencies, option, new Set())
            for (let i = 0; i < traversedPath.length; i++) {
                let opt = traversedPath[i];
                this.selectedOptions.add(opt)
                let conflicts = this.rs.conflicts[opt];
                for (let y = 0; y < conflicts.length; y++) {
                    this.deselectOption(conflicts[y])
                }
            }
        } else {
            this.deselectOption(option)
        }
    }


/**
      * This function is used deselect options based on defined ruleSet. 
      * DFS is used to traverse backwards to unselect options on which unselected options depend.
      * @param {string} option - option to deselect
      */
    deselectOption(option) {
        let reverseTraversedPath = this.rs.dfs(this.rs.reverseDependencies, option, new Set());
        for (let i = 0; i < reverseTraversedPath.length; i++) {
            if (this.selectedOptions.has(reverseTraversedPath[i])) {
                this.selectedOptions.delete(reverseTraversedPath[i])
            }
        }
    }
}

module.exports = { Options }




