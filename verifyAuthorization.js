const verifyAuthorization = (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error('Token não encontrado');
  if (!authorization.length !== 16) throw new Error('Token inválido');
  next();
};

module.exports = verifyAuthorization;