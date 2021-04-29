exports.run = (client) => {
  console.log(
    `${!client.isTesting ? "Abby" : "Anny"} tá na área! [${client.user.tag}]`
    );
}