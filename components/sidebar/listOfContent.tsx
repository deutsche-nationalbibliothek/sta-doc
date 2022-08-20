interface Props {
  anchors: [{ id: string; label: string }];
}

export default function ListOfContent({ anchors }: Props) {
  console.log("anchors", anchors);
  const anchs = anchors;
  const lastAnchorLevel = 1;
  const nestedArr = recursiveNestedArray(anchs, lastAnchorLevel);
  // console.log("nestedArr", nestedArr);
  return null;
}

function recursiveNestedArray(anchs, lastAnchorLevel) {
  const arr = [];
  //  Array.from(document.querySelectorAll(".header1,.header2"))
  // anchs.map((anchor, index) => {
  //   let level = parseInt(anchor.id.substring(anchor.id.indexOf("-") + 1));
  //   let item = { id: anchor.id, label: anchor.label };
  //   if (level == lastAnchorLevel) {
  //     // Array.isArray(nestedArr.at(-1))
  //     // ? nestedArr[nestedArr.length - 1].push(item)
  //     arr.push(item);
  //   } else if (level > lastAnchorLevel) {
  //     let restAnchors = anchs.slice(index + 1);
  //       arr.push(recursiveNestedArray(restAnchors, level));
  //     // nestedArr[level][nestedArr.length - 1].push([item]);
  //     // lastAnchorLevel = level;
  //   }
  //   // console.log("anchor", anchor);
  // });
  return arr;
}

function NewList(rest) {
  return <ul>{rest}</ul>;
}
function ListItem(item) {
  return <li>{item}</li>;
}

const unorderedList = (nestedArr) => {
  return (
    <ul>
      {nestedArr.map((item) => {
        if (Array.isArray(item)) {
          unorderedList(item);
          return;
        }
        return <li>{item.label}</li>;
      })}
    </ul>
  );
};
