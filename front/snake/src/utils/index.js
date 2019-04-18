import randomColor from 'randomcolor'

function getRandomColor(luminosity='bright') {
	const rgb = randomColor({ luminosity, format: 'rgbArray' })
	return rgb[0] * 256*256 + rgb[1] * 256 + rgb[2]
}

export {
    getRandomColor
}