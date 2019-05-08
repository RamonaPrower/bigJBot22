// imports

// exports
module.exports = {
    execute(message) {
             const i = message;
             console.log('summoned!' + this.info.name);
         }
}
module.exports.info = {
    name: 'Template name',
    description: 'Template Message',
    summon: 'Template Summon Info'
}
module.exports.regexp = '^!test'