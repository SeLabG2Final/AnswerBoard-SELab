import { addDoc, deleteDoc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import { storage } from '../../../firebase/firebase-config';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import styled from 'styled-components';
import { DeleteIcon } from '../../../components/styled/DeleteIcon';

function ResourcesTab() {
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const [uploading, setUploading] = useState(false);
    // const MAX_FILE_SIZE_IN_BYTES = 100000; // 100KB
    const MAX_FILE_SIZE_IN_BYTES = 1000000; // 1MB
    // const MAX_FILE_SIZE_IN_BYTES = 10000000; // 10MB
    const [progress, setProgress] = useState(0);
    const [resourceList, setResourceList] = useState([]);

    useEffect(() => {
        if (currentClass) {
            const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
            getDocs(resourcesColRef)
                .then((snapshot) => {
                    const promises = snapshot.docs.map((doc) => {
                        return { ...doc.data(), id: doc.id };
                    });
                    Promise.all(promises)
                        .then(resources => setResourceList(resources))
                })
                .catch(err => console.log(err.message))
        }

    }, [currentClass]);

    const checkFileInDB = (file) => {
        let isFileInDB;
        const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
        const doesResourceExistsQuery = query(resourcesColRef, where('name', '==', file.name));
        getDocs(doesResourceExistsQuery)
            .then((snapshot) => {
                if (snapshot.docs.length > 0) {
                    isFileInDB = true;
                } else {
                    isFileInDB = false;

                }
                console.log('is file in db? ', isFileInDB);
                if (!isFileInDB) {
                    uploadFile(file);
                } else {
                    alert('This same file already exists in class resources.',
                        '\nPlease delete existing one or rename the new file.');
                    return
                }
            })
            .catch(err => console.log(err.message))
        return isFileInDB;
    }

    const onFileChange = (e) => {
        if (!uploading) {
            const file = e.target.files[0];
            // clear input tag value
            e.target.value = null;
            if (file) {
                if (file.size > MAX_FILE_SIZE_IN_BYTES) {
                    alert('file too big. Can not upload');
                    return
                }
                checkFileInDB(file);
            }
        } else {
            console.log('uploading of another file is in progress... please wait till its over.');
            // clear input tag value
            e.target.value = null;
        }
    };

    const uploadFile = (file) => {
        const resourcesRef = ref(storage, `/resources/${currentClass.c_id}/${file.name}`);
        const uploadTask = uploadBytesResumable(resourcesRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (err) => {
                console.log(err.message)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        const resource = {
                            url: url,
                            name: file.name,
                            created_at: serverTimestamp()
                        };
                        const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
                        addDoc(resourcesColRef, resource)
                            .then((data) => {
                                const newResource = { ...resource, id: data.id }
                                console.log('new resource is : ', resource);
                                setResourceList([...resourceList, newResource]);
                            })
                        setProgress(0);
                    })
            }
        );
    }

    const deleteResource = (resource) => {
        const resourcesRef = ref(storage, `/resources/${currentClass.c_id}/${resource.name}`);
        deleteObject(resourcesRef)
            .then(() => {
                // File deleted successfully
                console.log('resource deleted : ', resource.id);
                const resourceDocRef = getDocRefById(resource.id, `/classes/${currentClass.c_id}/resources`);
                deleteDoc(resourceDocRef)
                    .then(() => {
                        console.log('doc deleted.');
                        setResourceList(resourceList.filter((listItem) => listItem.id !== resource.id));
                    })
            })
            .catch(err => console.log(err.message))

    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('file uploaded.');
    };

    return (
        <div>
            {
                user.role === 'instructor'
                &&
                <UploadFileForm onSubmit={onSubmit}>
                    <div>Max file size: {MAX_FILE_SIZE_IN_BYTES / 1000000} MB</div>
                    <label htmlFor="fileInput">
                        <FileUploadIcon
                            className='file-upload-icon'
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </FileUploadIcon>
                        <input
                            style={{ opacity: 0, position: "absolute", left: "-999999px" }}
                            type="file"
                            id="fileInput"
                            onChange={onFileChange}
                        />
                    </label>
                </UploadFileForm>
            }
            {
                progress > 0
                &&
                <div>
                    upload progress : {progress} %
                </div>
            }
            <ResourcesListContainer>
                {
                    resourceList.length > 0
                        ?
                        resourceList.map((resource) => (
                            <ResourceItem key={resource.id}>
                                <a href={resource.url} target="_blank">{resource.name}</a>
                                {
                                    user.role === 'instructor'
                                    &&
                                    currentClass?.instructors_list?.includes(user?.email)
                                    &&
                                    <DeleteIcon
                                        onClick={() => { deleteResource(resource) }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </DeleteIcon>
                                }
                            </ResourceItem>
                        ))
                        :
                        (
                            <div>No Resources yet.</div>
                        )
                }
            </ResourcesListContainer>
        </div>
    );
}

const FileUploadIcon = styled.svg`
    width: 2em;
    cursor: pointer;
`

const UploadFileForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--post-card-margin);
    margin-bottom: var(--post-card-margin);
`

const ResourcesListContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* margin-top: var(--post-card-margin); */
    gap: var(--post-card-margin);
`

const ResourceItem = styled.div`
    display: flex;
    justify-content: space-between;
    
    & > a {
        color: var(--dark-secondary-color);
        text-decoration: none;
        cursor: pointer;
    }

    & > a:hover {
        border-bottom: 1px solid var(--dark-secondary-color);
    }

    & > a:visited {
        decoration: none;
    }
`

export default ResourcesTab;