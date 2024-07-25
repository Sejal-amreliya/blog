const sanitize = (input) => {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  
  module.exports = sanitize;
  