const { AboutPageModel } = require('../models/index');
const fs = require('fs');
const path = require('path');

const getAboutPage = async (req, res, next) => {
    try {
        const aboutPage = await AboutPageModel.findOne({});

        if (aboutPage) {
          return res.status(200).json(aboutPage);
        } else {
          return res.status(404).json({ error: 'About page not found' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error, please try again later' });
    }
}

const createAboutPage = async (req, res, next) => {
    if (req.file) {
		const filename = req.file.filename;
		const imageUrl = `http://localhost:8081/uploads/homePage/${filename}`
		req.body.image = imageUrl;
	}
    
    try {
        let aboutPage = await AboutPageModel.findOne({});

        if (aboutPage && aboutPage.image) {
            const imageName = path.basename(aboutPage.image);
            const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'aboutPage', imageName);
            fs.unlink(absolutePath, (error) => console.log(error));
        }

        if (!aboutPage) {
            aboutPage = new AboutPageModel(req.body);
        } else {
            Object.assign(aboutPage, req.body);
        }

        const updatedAboutPage = await aboutPage.save();

        return res.status(200).json({ message: 'About page updated successfully', updatedAboutPage });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const updateAboutPage = async (req, res, next) => {
    if (req.file) {
		const filename = req.file.filename;
		const imageUrl = `http://localhost:8081/uploads/homePage/${filename}`
		req.body.image = imageUrl;
	}
    
    try {
        let aboutPage = await AboutPageModel.findOne({});

        if (aboutPage) {

            if (req.file) {
                const imageName = path.basename(aboutPage.image);
                const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'aboutPage', imageName);
                fs.unlink(absolutePath, (error) => console.log(error));
            }
        }

        if (!aboutPage) {
            aboutPage = new AboutPageModel(req.body);
        } else {
            Object.assign(aboutPage, req.body);
        }

        const updatedAboutPage = aboutPage.save();

        return res.status(200).json({ message: 'About page updated successfully', updatedAboutPage });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAboutPage,
    createAboutPage,
    updateAboutPage,
};