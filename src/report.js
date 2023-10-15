let reportInfo = function(vars, showType = false) {
    if (showType === true) {
        console.log('Data Type : ' + typeof vars, '\nValue : ' + vars);
    } else if(typeof showType !== 'boolean') {
        console.log(showType);
    } else {
        console.log(vars);
    }
};

export default reportInfo;
