
/**
 * RuleSet {Class} - defines set of rules for options.
 * dependencies {object} - a graph representing dependencies b/w options
 * conflicts {object} - represents conflicts b/w options
 * reverseDependencies {object} - represents reverse dependencies b/w options. This used for unselecting options
 */
class RuleSet {

    constructor() {
        this.dependencies = {};
        this.conflicts = {};
        this.reverseDependencies = {};
    }

    /**
       * This function adds a dependency between options
       * @param {string} opt1 - first option which depends on the second option
       * @param {string} opt2 - second option on which first option depends
       */
    addDependency(opt1, opt2) {
        this.addOptions(opt1, opt2);
        this.dependencies[opt1].push(opt2)
        this.reverseDependencies[opt2].push(opt1)
    }


    /**
       * This function adds a confict between options
       */
    addConflict(opt1, opt2) {
        this.addOptions(opt1, opt2);
        this.conflicts[opt1].push(opt2);
        this.conflicts[opt2].push(opt1);
    }


    /** 
       * This function adds new options to dependencies, reverseDependencies and conflicts
       */
    addOptions(opt1, opt2) {
        if (!this.dependencies.hasOwnProperty(opt1)) this.dependencies[opt1] = [];
        if (!this.dependencies.hasOwnProperty(opt2)) this.dependencies[opt2] = [];

        if (!this.reverseDependencies.hasOwnProperty(opt1)) this.reverseDependencies[opt1] = [];
        if (!this.reverseDependencies.hasOwnProperty(opt2)) this.reverseDependencies[opt2] = [];

        if (!this.conflicts.hasOwnProperty(opt1)) this.conflicts[opt1] = [];
        if (!this.conflicts.hasOwnProperty(opt2)) this.conflicts[opt2] = [];
    }


    /**
      * This function checks that no option can depend, directly or indirectly, on another option and also be mutually exclusive with it
      * @returns {Boolean}
      */
    checkIfCoherent() {
        const options = Object.keys(this.dependencies);
        for (const opt in options) {
            const option = options[opt];
            const traversedOptions = this.dfs(this.dependencies, option, new Set());

            for (let i = 0; i < traversedOptions.length; i++) {
                if (traversedOptions[i] != option && this.conflicts[option].includes(traversedOptions[i])) return false;
            }

            for (let x = 0; x < traversedOptions.length; x++) {
                const dep1 = traversedOptions[x];
                for (let y = 0; y < traversedOptions.length; y++) {
                    const dep2 = traversedOptions[y];
                    if (dep1 != dep2 && (this.conflicts[dep2].includes(dep1) || this.conflicts[dep1].includes(dep2))) return false;
                }
            }
        }
        return true;
    }


    /**
       * This function implements Depth-First Search,it used to select and unselect options based on traversal through the given graph
       * @param {object} graph - a graph representing dependencies b/w options
       * @param {string} node - start node
       * @param {Set} visited - contains the visited nodes
       * @returns {Array} - contains options present in the DFS traversal from start node
       */
    dfs(graph, node, visited) {
        if (!visited.has(node)) {
            visited.add(node);
            for (let neighbour in graph[node]) {
                if (!visited.has(graph[node][neighbour])) this.dfs(graph, graph[node][neighbour], visited)
            }
        }
        return Array.from(visited);
    }

}

// let ruleSet = new RuleSet()
// let options = new Options(ruleSet)
// ruleSet.addDependency('a', 'b')
// ruleSet.addDependency('b', 'c')
// ruleSet.addDependency('c', 'a')
// ruleSet.addDependency('d', 'e')
// ruleSet.addConflict('c', 'e')

// options.toggle('a')

// ruleSet.addDependency('f', 'f')
// options.toggle('f')

// options.toggle('e')
// console.log(options.getSelection())

module.exports = { RuleSet }




