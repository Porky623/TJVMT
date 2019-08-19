//Helper to display a single row for a single index
let getRow = async(ranks) => {
  var out = '';
  for(var i=0; i<ranks.length; i++) {
    let rank = ranks[i];
    out = out + '<tr>';
    out = out + '<td>' + rank.rank + '</td>';
    out = out + '<td>' + rank.studentName + '</td>';
    out = out + '<td>' + rank.indexVal + '</td>';
    out = out + '<td>' + rank.studentGradYear + '</td>';
    out = out + '<td>' + rank.scoreDist + '</td>';
    out = out + "</tr>";
  }
  console.log(out);
  return out;
};
module.exports = {
  getTable: getRow
};