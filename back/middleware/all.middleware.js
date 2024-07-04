const logger = (req, _, next) => {
    console.log(req.session);
    console.log(req.session.data || "Данных нет");
    console.log(req.session.userEmail || "Пользователь не авторизован");
    console.log(req.sessionID || "Данных sessionID нет");
    console.log(req.session.cookie || "Данных cookie нет");
    console.log("\n");
    next();
  };
  
  module.exports = { logger };