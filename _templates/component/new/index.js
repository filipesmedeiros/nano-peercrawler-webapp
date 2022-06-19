module.exports = {
  params: ({ args }) => {
    const nameSplit = args.name.split('/')
    let componentName = nameSplit[nameSplit.length - 1]
    componentName = `${componentName[0].toLocaleUpperCase()}${componentName.slice(
      1
    )}`
    return { ...args, componentName }
  },
}
