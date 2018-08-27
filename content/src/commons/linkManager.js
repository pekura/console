export const navigate = (path, options) => {
    const relativePath = path[0] !== '/';
    const navigation = {
      msg: 'luigi.navigation.open',
      params: Object.assign({
        link: path,
        relative: relativePath,
      }, options)
    };

    window.parent.postMessage(navigation, '*');
}