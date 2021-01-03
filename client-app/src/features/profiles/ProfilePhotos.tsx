import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';
import { rootStoreContext } from '../../app/stores/rootStore';

const ProfilePhotos = () => {
    const { profileStore: {
        profile, isCurrentUser, uploadPhoto, uploadingPhoto, setMainPhoto, settingMainPhoto, deletePhoto, deletingPhoto
    } } = useContext(rootStoreContext);

    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState<string | undefined>(undefined);

    const handleUploadPhoto = async (photo: Blob) => {
        await uploadPhoto(photo);
        setAddPhotoMode(false);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser &&
                        <Button
                            floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadPhoto} loading={uploadingPhoto} />
                    ) : (
                            <Card.Group itemsPerRow={5}>
                                {profile?.photos.map((photo) => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {isCurrentUser &&
                                            <Button.Group fluid width={2}>
                                                <Button
                                                    name={photo.id}
                                                    basic
                                                    positive
                                                    content='Main'
                                                    loading={target === photo.id && settingMainPhoto}
                                                    disabled={photo.isMain || (target === photo.id && deletingPhoto)}
                                                    onClick={(e) => {
                                                        setMainPhoto(photo);
                                                        setTarget(e.currentTarget.name);
                                                    }}
                                                />
                                                <Button
                                                    name={photo.id}
                                                    basic
                                                    negative
                                                    icon='trash'
                                                    loading={target === photo.id && deletingPhoto}
                                                    disabled={photo.isMain || (target === photo.id && settingMainPhoto)}
                                                    onClick={(e) => {
                                                        deletePhoto(photo);
                                                        setTarget(e.currentTarget.name);
                                                    }}
                                                />
                                            </Button.Group>}
                                    </Card>
                                ))}
                            </Card.Group>
                        )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfilePhotos);
