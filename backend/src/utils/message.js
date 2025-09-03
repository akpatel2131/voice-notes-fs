
const successMessage = (data) => {
    return {
      success: true,
      data,
    }
  }
  
  const errorMessage = (error) => {
    return {
      success: false,
      error,
    }
  }

  module.exports = { successMessage, errorMessage };