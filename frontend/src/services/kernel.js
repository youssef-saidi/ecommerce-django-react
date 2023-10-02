// import app from "kernel/app";
// import "kernel/auth";
// import "kernel/firestore";
// import "kernel/storage";
import kernelConfig from "./config";
import axios from "axios";


class kernel {
  constructor() {
    // app.initializeApp(kernelConfig);
    // this.storage = app.storage();
    // this.db = app.firestore();
    // this.auth = app.auth();
    // this.auth.createUserWithEmailAndPassword("email@gmail.com", "password");
  }

  // AUTH ACTIONS ------------

  createAccount = async (name, email, password) => {

    const response = await axios.post(`http://127.0.0.1:8000/api/signup/`, {
      name: name,
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response
  }

  signIn = async (email, password) => {
    // this.auth.signInWithEmailAndPassword(email, password);
    const response = await axios.post(`http://127.0.0.1:8000/api/signin/`, {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.data) {
      return response.data.data
    } else {
      return false
    }

  }

  // signInWithGoogle = () =>
  //   this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  // signInWithFacebook = () =>
  //   this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  // signInWithGithub = () =>
  //   this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => {
    localStorage.setItem("data", '{}')
  }

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => this.db.collection("users").doc(id).set(user);

  getUser = (id) => this.db.collection("users").doc(id).get();

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  // reauthenticate = (currentPassword) => {
  //   const user = this.auth.currentUser;
  //   const cred = app.auth.EmailAuthProvider.credential(
  //     user.email,
  //     currentPassword
  //   );

  //   return user.reauthenticateWithCredential(cred);
  // };

  // updateEmail = (currentPassword, newEmail) =>
  //   new Promise((resolve, reject) => {
  //     this.reauthenticate(currentPassword)
  //       .then(() => {
  //         const user = this.auth.currentUser;
  //         user
  //           .updateEmail(newEmail)
  //           .then(() => {
  //             resolve("Email Successfully updated");
  //           })
  //           .catch((error) => reject(error));
  //       })
  //       .catch((error) => reject(error));
  //   });

  // updateProfile = (id, updates) =>
  //   this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise(async (resolve, reject) => {
      try {
        const response = localStorage.getItem("data")

        resolve(JSON.parse(response));

      } catch (err) {
        reject(new Error("Auth State Changed failed"));


      }

    });

  // saveBasketItems = (items, userId) =>
  //   this.db.collection("users").doc(userId).update({ basket: items });



  // // PRODUCT ACTIONS --------------

  getSingleProduct = async (id) => {
    // new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/product/single/?id=${id}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response;
    } catch (e) {
      return e?.message || ":( Failed to fetch product.";
    }

  };

  getProducts = async (lastRefKey) => {
    let didTimeout = false;
    return await new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const response = await axios.get("http://127.0.0.1:8000/product/all/", {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })

            const products = response.data.data;
            const lastKey = ""

            resolve({ products, lastKey });
          } catch (e) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const totalQuery = await axios.get("http://127.0.0.1:8000/product/all/", {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            const total = totalQuery.data.data.length;


            clearTimeout(timeout);
            if (!didTimeout) {
              const products = totalQuery.data.data;

              const lastKey = ""

              resolve({ products, lastKey, total });
            }
          } catch (e) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  // searchProducts = (searchKey) => {
  //   let didTimeout = false;

  //   return new Promise((resolve, reject) => {
  //     (async () => {
  //       const productsRef = this.db.collection("products");

  //       const timeout = setTimeout(() => {
  //         didTimeout = true;
  //         reject(new Error("Request timeout, please try again"));
  //       }, 15000);

  //       try {
  //         const searchedNameRef = productsRef
  //           .orderBy("name_lower")
  //           .where("name_lower", ">=", searchKey)
  //           .where("name_lower", "<=", `${searchKey}\uf8ff`)
  //           .limit(12);
  //         const searchedKeywordsRef = productsRef
  //           .orderBy("dateAdded", "desc")
  //           .where("keywords", "array-contains-any", searchKey.split(" "))
  //           .limit(12);

  //         // const totalResult = await totalQueryRef.get();
  //         const nameSnaps = await searchedNameRef.get();
  //         const keywordsSnaps = await searchedKeywordsRef.get();
  //         // const total = totalResult.docs.length;

  //         clearTimeout(timeout);
  //         if (!didTimeout) {
  //           const searchedNameProducts = [];
  //           const searchedKeywordsProducts = [];
  //           let lastKey = null;

  //           if (!nameSnaps.empty) {
  //             nameSnaps.forEach((doc) => {
  //               searchedNameProducts.push({ id: doc.id, ...doc.data() });
  //             });
  //             lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
  //           }

  //           if (!keywordsSnaps.empty) {
  //             keywordsSnaps.forEach((doc) => {
  //               searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
  //             });
  //           }

  //           // MERGE PRODUCTS
  //           const mergedProducts = [
  //             ...searchedNameProducts,
  //             ...searchedKeywordsProducts,
  //           ];
  //           const hash = {};

  //           mergedProducts.forEach((product) => {
  //             hash[product.id] = product;
  //           });

  //           resolve({ products: Object.values(hash), lastKey });
  //         }
  //       } catch (e) {
  //         if (didTimeout) return;
  //         reject(e);
  //       }
  //     })();
  //   });
  // };

  getFeaturedProducts = async (itemsCount = 12) => {
    const response = await axios.get("http://127.0.0.1:8000/product/featuredProducts/", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response
  }


  getRecommendedProducts = async (itemsCount = 12) => {
    const response = await axios.get("http://127.0.0.1:8000/product/recommendedProducts/", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response
  }

  addProduct = async (id, product) => {
    // this.db.collection("products").doc(id).set(product);
    const response = await axios.post("http://127.0.0.1:8000/product/addProduct/", {
      ...product
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

  }


  // generateKey = () => this.db.collection("products").doc().id;

  // storeImage = async (id, folder, imageFile) => {
  //   const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
  //   const downloadURL = await snapshot.ref.getDownloadURL();

  //   return downloadURL;
  // };

  // deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = async (id, updates) => {
    const response = await axios.post("http://127.0.0.1:8000/product/editProduct/", {
      idProduct: id,
      ...updates
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

  }
  removeProduct = async (id) => {
    const response = await axios.post("http://127.0.0.1:8000/product/removeProduct/", {
      idProduct: id
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

  };
}

const kernelInstance = new kernel();

export default kernelInstance;
