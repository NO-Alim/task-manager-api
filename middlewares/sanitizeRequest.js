const sanitizeRequest = (req, res, next) => {
    const sanitize = (obj) => {
        for (let key in obj) {
          if (/[$.]/.test(key)) {
            const cleanKey = key.replace(/[$.]/g, '');
            obj[cleanKey] = obj[key];
            delete obj[key];
          }
          if (typeof obj[key] === 'object') {
            sanitize(obj[key]);
          }
        }
      };
    
      if (req.body) sanitize(req.body);
      if (req.query) sanitize(req.query);
      if (req.params) sanitize(req.params);
    
      next();
}

export default sanitizeRequest;