const { Colors } = require('discord.js');

/**
 * Retourne un élément aléatoire d'un tableau
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Retourne une couleur Discord aléatoire
 */
function getRandomColor() {
    const colorKeys = Object.keys(Colors);
    return Colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
}

module.exports = { getRandomElement, getRandomColor };
