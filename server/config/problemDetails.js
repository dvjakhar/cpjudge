var index;

function getIndex (title) {
    for(var i=0;i<title.length;i++){
        if(title[i]=='.'){
            return index = title.slice(0, i);
        }
    }
}

function getDifficulty () {
    if(index==='A' || index==='B') {
        return 'Easy';
    } else if(index === 'C' || index==='D') {
        return 'Medium';
    } else {
        return 'Hard';
    }
}

function getProblemNum ( link ) {
    var ans="";
    var flag1=0;
    for(var i=link.length-1;i>=0;i--)
    {
        if(flag1 && link[i]=='/'){
            break;
        }
        if(link[i]<='9' && link[i]>=0){
            flag1=1;
            ans+=link[i];
        }
    }
    var rev = "";
    for(var i=0;i<ans.length;i++){
        rev+=ans[ans.length-i-1];
    }
    rev+=index;
    return rev;
}

exports.getIndex = getIndex;
exports.getDifficulty = getDifficulty;
exports.getProblemNum = getProblemNum;