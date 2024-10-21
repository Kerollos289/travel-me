import React from "react";

const touristPage = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Tourist Page</h1>
      <p>This is a temporary page for tourists to test redirection.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default touristPage;
