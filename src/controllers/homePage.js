const { HomePageModel } = require('../models/index');
const fs = require('fs');
const path = require('path');

const getHomePage = async (req, res, next) => {
    try {
        const homePage = await HomePageModel.findOne({});

        if (homePage) {
          return res.status(200).json({ homePage });
        } else {
          return res.status(404).json({ error: 'Home page not found' });
        }

      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const createHomePage = async (req, res, next) => {
    if(req.files) {
        if (req.files.headerImage) {
            const fileName = req.files.headerImage[0].filename;
            const headerImageUrl = `http://localhost:8081/uploads/homePage/headerImages/${fileName}`;
            req.body.headerImage = headerImageUrl;
        }
    
        if (req.files.footerImage) {
            const fileName = req.files.footerImage[0].filename;
            const footerImageUrl = `http://localhost:8081/uploads/homePage/footerImages/${fileName}`;
            req.body.footerImage = footerImageUrl;
        }
    }
    
    try {
        let homePage = await HomePageModel.findOne({});

        if (homePage) {

            if (homePage.headerImage) {
                const imageName = path.basename(homePage.headerImage);
                const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'homePage', 'headerImages', imageName);
                fs.unlink(absolutePath, (error) => console.log(error));
            }

            if (homePage.footerImage) {
                const imageName = path.basename(homePage.footerImage);
                const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'homePage', 'footerImages', imageName);
                fs.unlink(absolutePath, (error) => console.log(error));
            }
        }

        if (!homePage) {
            homePage = new HomePageModel(req.body);
        } else {
            Object.assign(homePage, req.body);
        }

        const updatedHomePage = await homePage.save();

        return res.status(200).json({ message: 'Home page updated successfully', updatedHomePage });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const updateHomePage = async (req, res, next) => {
    if (req.files) {
        if (req.files.headerImage) {
            const fileName = req.files.headerImage[0].filename;
            const headerImageUrl = `http://localhost:8081/uploads/homePage/headerImages/${fileName}`;
            req.body.headerImage = headerImageUrl;
        }
        if (req.files.footerImage) {
            const fileName = req.files.footerImage[0].filename;
            const footerImageUrl = `http://localhost:8081/uploads/homePage/footerImages/${fileName}`;
            req.body.footerImage = footerImageUrl;
        }
    }
    try {
        let homePage = await HomePageModel.findOne({});

        if (homePage) {
            if (req.files.headerImage) {
                const imageName = path.basename(homePage.headerImage);
                const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'homePage', 'headerImages', imageName);
                fs.unlink(absolutePath, (error) => console.log(error));
            }

            if (req.files.footerImage) {
                const imageName = path.basename(homePage.footerImage);
                const absolutePath = path.resolve(__dirname, '..', 'public', 'uploads', 'homePage', 'footerImages', imageName);
                fs.unlink(absolutePath, (error) => console.log(error));
            }
        }

        if (!homePage) {
            homePage = new HomePageModel(req.body);
        } else {
             Object.assign(homePage, req.body);
        }

        const updatedHomePage = await homePage.save();
        
        return res.status(200).json({ message: 'Home page updated successfully', updatedHomePage });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getHomePage,
    createHomePage,
    updateHomePage,
};