import {
  db,
  getDownloadURL,
  ref,
  storage,
  uploadBytes,
  createUserWithEmailAndPassword,
  auth,
  updateProfile,
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  signInWithEmailAndPassword,
  deleteDoc,
} from "./firebase";

const createUser = async (email, password, profilePic, name) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const storageRef = ref(storage, `profilePic/${profilePic.name}`); // create a ref in firebase storage

  // Uploading the image
  await uploadBytes(storageRef, profilePic); // adding image in storage

  // Getting the URL of the profile picture
  const url = await getDownloadURL(storageRef); //getting url of profile picture
  console.log(url);

  // Update user profile
  await updateProfile(auth.currentUser, {
    displayName: `${name}`,
    photoURL: url,
  });
  console.log("acc created");
};

const signInUser = async (email, password) => {
  try {
    // Sign in the user using email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Successfully signed in
    const user = userCredential.user; // This is the signed-in user object
    console.log("User signed in:", user);
    console.log("login success");
  } catch (error) {
    console.error("Error signing in:", error.message);
  }
};

const addingBlogToFirestore = async (
  folderRef,
  blogImg,
  collectionName,
  blogTitle,
  blogMessage,
  user
) => {
  const date = new Date();
  const storageRef = ref(storage, `${folderRef}/${blogImg[0].name}`);
  await uploadBytes(storageRef, blogImg[0]);
  const blogUrl = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, collectionName), {
    blogUrl,
    blogTitle,
    blogMessage,
    uid: user.uid,
    userName: user.displayName,
    userPic: user.photoURL,
    date: Timestamp.fromDate(date),
  });
  console.log("blog added")
  return { blogUrl, docId: docRef.id };
};

const getUserBlogs = async (uid, collectionName) => {
  try {
    // Create a query to get all blogs ordered by date in descending order
    const allBlogsQuery = query(
      collection(db, collectionName),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(allBlogsQuery);

    const singleUserData = [];
    const allUserData = [];

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      if (uid && uid === data.uid) {
        singleUserData.push(data);
      } else {
        allUserData.push(data);
      }
    });
    return { allUserData, singleUserData };
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    throw error; // Rethrow or handle the error as needed
  }
};

const getSingleDoc = async (id, collection) => {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};
const updateSingleDoc = async (id, collection, title, description, url) => {
  const blogRef = doc(db, collection, id);

  // Update the document with blogUrl only if it's provided
  await updateDoc(blogRef, {
    blogTitle: title,
    blogMessage: description,
    ...(url && { blogUrl: url }), // Conditionally include blogUrl if url is truthy
  });
};

const imageToUrl = async (file, imageRef) => {
  const storageRef = ref(storage, `${imageRef}/${file[0].name}`);
  await uploadBytes(storageRef, file[0]);
  const blogUrl = await getDownloadURL(storageRef);

  return blogUrl;
};

const deleteUserBlog = async (blogId) => {
  try {
    const blogRef = doc(db, "Blog", blogId); // Reference to the specific blog document
    await deleteDoc(blogRef); // Deletes the document
    console.log(`Blog with ID ${blogId} has been deleted.`);
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
};
const updateUserBlog = async (blogId, updatedData) => {
  try {
    const blogRef = doc(db, "Blog", blogId); // Reference to the specific blog document
    await updateDoc(blogRef, updatedData); // Updates the document with new data
    console.log(`Blog with ID ${blogId} has been updated.`);
  } catch (error) {
    console.error("Error updating blog:", error);
  }
};

export {
  getUserBlogs,
  getSingleDoc,
  updateSingleDoc,
  imageToUrl,
  createUser,
  addingBlogToFirestore,
  signInUser,
  deleteUserBlog,
  updateUserBlog
};
