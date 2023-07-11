const uuid = require("uuid");
const path = require("path");
const ApiError = require("../replies/ApiError");
const allowedPhotoExtensions = require('../enums/allowedPhotoExtensions');

class FilesParser {
    static parseArrayAny(files, folder) {
        folder = folder || '';

        let fileNames = [];

        if (files) {
            files = (Array.isArray(files)) ? files : [files];
            files.forEach((file) => {
                let fileNameParts = file.name.split('.');
                let fileExtension = '';
                if (fileNameParts.length > 1) {
                    fileExtension = '.' + fileNameParts.pop();
                }

                let fileName = uuid.v4() + fileExtension;
                file.mv(path.resolve(__dirname, '..', 'static', folder, fileName));
                fileNames.push(fileName);
            });
        }

        return fileNames;
    }

    static parsePhoto(file, folder) {
        folder = folder || '';

        let fileName;

        if (file) {
            if (Array.isArray(file)) {
                throw ApiError.badRequest('You can upload only one file in avatar');
            }

            let mimetype = file.mimetype.split('/');
            if (mimetype[0] !== 'image') {
                throw ApiError.badRequest('Uploaded file is not an image');
            }
            if(!allowedPhotoExtensions.includes(mimetype[1])) {
                throw ApiError.badRequest(`Invalid file extension. Supported extensions: ${allowedPhotoExtensions}`)
            }

            fileName = `${uuid.v4()}.${mimetype[1]}`;
            file.mv(path.resolve(__dirname, '..', 'static', folder, fileName));
        }

        return fileName;
    }
}

module.exports = FilesParser;