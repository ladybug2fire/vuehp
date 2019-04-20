import _ from 'lodash'
import * as math from 'mathjs'

export function genArray(node, schemes) {
  if (!node) return null;
  const tempNode = _.cloneDeep(node);
  if (_.isEmpty(node.child)) {
    tempNode.child = _.map(schemes, e=>_.assign(e, {level: node.level+1}));
    return { scheme: tempNode };
  }
  const children = node.child.map(e => genArray(e, schemes));
  return {
    scheme: _.flatten([...children.map(e => e.scheme).filter(e => e)]),
    target: _.flatten(
      [tempNode].concat(...children.map(e => e.target).filter(e => e))
    )
  };
}

export function isValid(tree) {
    // 包含评价方案和评价准则才合法
    return (
      _.isArray(_.get(tree, "target")) &&
      _.isArray(_.get(tree, "scheme"))
    );
}

export function genOptions() {
    const num = 9;
    const range = new Array(num).fill(0).map((e, i) =>({label: i+1, value: i+1}));
    const fractionRange = range.slice(1).map(e => ({label: `1/${e.value}`, value: math.fraction(`1/${e.value}`)}));
    return range.concat(fractionRange);
}

export function genThead(h, node) {
  let heads = [node.name, ...node.child.map(e => e.name)];
  let th = heads.map(e => h("th", [e]));
  let th_sub = ["U", "V", "W"].map(e => h("th", [e, h("sub", ["i"])]));
  return h("thead", [h("tr", [th, th_sub])]);
}

export function tree2map(tree, parentId=null){
    let result = {};
    _.map(tree, (e)=>{
        _.set(result, e.id ,(_.assign(_.pick(e, ['level','id','name']),{
            child: _.map(e.child, e=> e.id),
            parent: parentId
        })));
        if(!_.isEmpty(e.child)){
            result = _.assign(result, tree2map(e.child, e.id))
        }
    })
    return result;
}

// 平均随机一致性指标R.I.表（1000次正互反矩阵计算结果） 1-15
export const R_I = [
    0,
    0,
    0.5,
    0.89,
    1.12,
    1.26,
    1.36,
    1.41,
    1.46,
    1.49,
    1.52,
    1.54,
    1.56,
    1.58,
    1.59
  ];