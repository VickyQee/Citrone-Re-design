const response = (message, data = null, status = true) => ({
    message,
    data,
    status
  })
  
  const except = (obj, ...args) => {
    args.forEach(arg => delete obj[arg])
    return obj
  } 
  
  
  const generateToken = () =>  Math.floor(Math.random() * 10000) + 10000
  
  module.exports = {
    response,
    generateToken,
    except
  }
  
  