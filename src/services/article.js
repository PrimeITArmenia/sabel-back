const { ArticleModel, CategoryModel, UserModel } = require('../models/index');
const httpStatus = require("http-status");
const path = require("path");
const fs = require("fs");
const sendMail = require('../email/sendEmail');

async function create(req, res, next){
    if (req.file) {
		const filename = req.file.filename
        const folderName = req.body.name.replace(/ /g, '_');
        const uploadPath = path.resolve(__dirname, `../public/uploads/articles/${folderName}`);

		if (!fs.existsSync(uploadPath)) {
		  fs.mkdirSync(uploadPath, { recursive: true });
		}

        const oldPath = path.resolve(__dirname, `../public/uploads/articles/${filename}`);
        const newPath = path.resolve(uploadPath, filename);

        fs.renameSync(oldPath, newPath);

		const imageUrl = `http://localhost:8081/uploads/articles/${folderName}/${filename}`
		req.body.image = imageUrl;
	}
	try {
		console.log('Req Body____', req.body)
		const { position } = req.body;
		const categoryId = req.body.category;

		const existingArticle = await ArticleModel.findOne({ position, categoryId });

		if (existingArticle) {
			existingArticle.position = null;
			await existingArticle.save();
		}
		console.log(':::::::::::::::::::::::::::::::::::::', req.body)
		const article = new ArticleModel(req.body);
		const savedArticle = await article.save();
		
        await CategoryModel.findByIdAndUpdate(categoryId, {
            $push: { articles: savedArticle._id }
        });

		if (savedArticle.status === 'published') {
            const users = await UserModel.find({ receiveEmails: true });
			const message = {
				subject: `New Article ${savedArticle.name}`,
				text: `We are excited to share with you our latest article, ${savedArticle.name}.`
			}

            users.forEach(user => {
				sendMail(user.email, message);
            });
        }

		res.status(httpStatus.CREATED);
		res.json(savedArticle);
	} catch (error) {
		next(error);
	}
}

module.exports = {create}