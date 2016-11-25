// Alpha version of multi-arg find.
function find(array, callback) {
    const found = [];

    for (let i = 0; i <= array.length - callback.length; i++) {
        const elems = [];

        for (let j = 0; j < callback.length; j++) {
            elems.push(array[i + j]);
        }

        if (callback([...elems])) {
            found.push(curr);
        }
    }

    return found;
}
