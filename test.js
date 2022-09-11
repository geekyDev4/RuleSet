
let { RuleSet } = require('./ruleSet'),
 {Options} = require('./options'),
 chai = require('chai'),
 expect = chai.expect;

describe('RuleSet', () => {
  let ruleSet, options

  beforeEach(() => {
    ruleSet = new RuleSet()
    options = new Options(ruleSet)
  })

  it('a,a is coherent', () => {
    ruleSet.addDependency('a', 'a')
    expect(ruleSet.checkIfCoherent()).equal(true)
  })

  it('a,b b,a is coherent', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('b', 'a')
    expect(ruleSet.checkIfCoherent()).equal(true)
  })

  it('a,b a,b is not coherent', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addConflict('a', 'b')
    expect(ruleSet.checkIfCoherent()).equal(false)
  })

  it('a,b b,c a-c is not coherent', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('b', 'c')
    ruleSet.addConflict('a', 'c')
    expect(ruleSet.checkIfCoherent()).equal(false)
  })

  it('test toggle', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('b', 'c')
    ruleSet.addDependency('c', 'a')
    ruleSet.addDependency('d', 'e')
    ruleSet.addConflict('c', 'e')
    expect(ruleSet.checkIfCoherent()).equal(true)

    options.toggle('a')
    expect(options.getSelection().sort()).to.eql(['a', 'b', 'c'])


    ruleSet.addDependency('f', 'f')
    options.toggle('f')
    expect(options.getSelection().sort()).to.eql(['a', 'b', 'c', 'f'])

    options.toggle('e')
    expect(options.getSelection().sort()).to.eql(['e', 'f'])

    options.toggle('b')
    expect(options.getSelection().sort()).to.eql(['a', 'b', 'c', 'f'])

    ruleSet.addDependency('b', 'g')
    options.toggle('g')
    options.toggle('b')
    expect(options.getSelection().sort()).to.eql(['f', 'g'])
  })

  it('a,b b,c toggle', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('b', 'c')

    options.toggle('c')
    expect(options.getSelection().sort()).to.eql(['c'])
  })

  it('a,b b,c c,d d,e a,f e-f is not coherent', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('b', 'c')
    ruleSet.addDependency('c', 'd')
    ruleSet.addDependency('d', 'e')
    ruleSet.addDependency('a', 'f')
    ruleSet.addConflict('e', 'f')
    expect(ruleSet.checkIfCoherent()).equal(false)
  })

  it('a,b b,c toggle', () => {
    ruleSet.addDependency('a', 'b')
    ruleSet.addDependency('a', 'c')
    ruleSet.addConflict('b', 'd')
    ruleSet.addConflict('b', 'e')

    expect(ruleSet.checkIfCoherent()).equal(true)

    options.toggle('d')
    options.toggle('e')
    options.toggle('a')
    expect(options.getSelection().sort()).to.eql(['a', 'b', 'c'])
  })
})