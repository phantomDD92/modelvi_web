import { PageMetaData, StyledInput } from "@/components/common";
import { ImportContentTable } from "@/components/model";
import { getModelContents, importModelContents } from "@/redux/v2/actions";
import { F2FStoryType, Platform, SERVER_PATH, StoryType } from "@/utils/const";
import { getPlatformName } from "@/utils/string";
import { Button, Card, Form, Row, Col, Steps, List, Upload, Space, Checkbox, Radio, message } from "antd";
import { useEffect, useState } from "react";
import { LuCommand, LuImage, LuInbox, LuStepBack, LuStepForward, LuText, LuUpload } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const AgencyImportContentPage = () => {

  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [tagStr, setTagStr] = useState('');
  const [captions, setCaptions] = useState([]);
  const [caption, setCaption] = useState('');
  const [folder, setFolder] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [f2fStoryType, setF2fStoryType] = useState(StoryType.NONE);
  const [knkyStoryType, setKnkyStoryType] = useState(StoryType.NONE);
  const [contents, setContents] = useState([]);
  const { modelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const model = useSelector(state => state.v2.contentModel);

  const ImportStep = {
    INPUT: 0,
    IMPORT: 2,
  }

  useEffect(() => {
    dispatch(getModelContents(modelId));
  }, []);

  const handleNextClick = () => {
    // check elements
    if (platforms.length == 0) {
      message.warning("Please select platforms");
      return;
    }
    if (folder.trim() == "") {
      message.warning("Please input folder");
      return;
    }
    if (tagStr.trim() == "") {
      message.warning("Please input tags");
      return;
    }
    if (fileList.length == 0) {
      message.warning("Please upload images");
      return;
    }
    if (captions.length == 0) {
      message.warning("Please input captions");
      return;
    }
    setStep(ImportStep.IMPORT);
    // prepare contents
    let importContents = [];
    let id = 0;
    const captionsLen = captions.length;
    const tags = tagStr.replaceAll("#", " ").trim().split(/\s+/);
    for (var fileInfo of fileList) {
      const randomIndex = Math.floor(Math.random() * captionsLen);
      importContents.push({
        _id: id++,
        platforms: platforms,
        knkyStoryType,
        f2fStoryType,
        title: captions[randomIndex],
        postTags: tags,
        media: { name: fileInfo.response?.file, mode: fileInfo.type },
        mode: (fileInfo.type || "image").split("/")[0],
        folder: folder,
      });
    }
    setContents(importContents);
  }

  const handleBackClick = () => {
    setStep(ImportStep.INPUT);
  }
  const handleFinishClick = () => {
    dispatch(importModelContents(model, contents, () => navigate(-1)));
  }

  const handleDeleteContent = (content) => {
    const newContents = [...contents];
    const contentIndex = newContents.findIndex(item => item._id == content._id)
    if (contentIndex >=0 ) {
      newContents.splice(contentIndex, 1);
    }
    console.log(content, contents, contentIndex, newContents);
    setContents(newContents);
  }

  const handleMediaChange = ({ fileList }) => {
    setFileList(fileList);
  }

  const handleAppendCaption = () => {
    const newCaptions = captions;
    newCaptions.push(caption)
    setCaptions(newCaptions);
    setCaption("");
  }

  return (
    <>
      <PageMetaData title="Import" />
      <Card
        title={model ? `Import Contents - [${model.owner?.name}] ${model.number}. ${model.name} ` : "Import Contents"}
        extra={step == ImportStep.INPUT
          ? <Button type="primary" icon={<LuStepForward />} onClick={handleNextClick}>Next</Button>
          : <Space>
            <Button icon={<LuStepBack />} onClick={handleBackClick}>Back</Button>
            <Button type="primary" icon={<LuCommand />} onClick={handleFinishClick}>Finish</Button>
          </Space>
        }
      >
        {step == ImportStep.INPUT
          ? <Form
            layout="vertical"
            className="p-10 min-h-[500px]">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label="Platforms :" >
                  <Checkbox.Group
                    value={platforms}
                    options={[
                      Platform.F2F,
                      Platform.KNKY,
                      Platform.FNC,
                      Platform.FAN,
                      Platform.LOYALFANS,
                      Platform.MALOUM,
                      Platform.FANVUE,
                      Platform.FOURBASED,
                      Platform.MYMFANS,
                      Platform.FETLIFE,
                      Platform.ONLYFANS,
                      // Platform.PORNHUB,
                      // Platform.DFANXYZ,
                    ].map(item => ({ label: getPlatformName(item), value: item }))}
                    onChange={value => setPlatforms(value)} />
                </Form.Item>
                <Row>
                  {platforms.includes(Platform.F2F) &&
                    <Col span={12}>
                      <Form.Item label="F2F Story :">
                        <Radio.Group
                          buttonStyle="solid"
                          optionType="button"
                          value={f2fStoryType}
                          onChange={e => setF2fStoryType(e.target.value)}
                          options={[
                            { label: 'None', value: StoryType.NONE },
                            { label: 'Public', value: StoryType.PUBLIC },
                            { label: 'Followers', value: StoryType.FOLLOWER },
                            { label: 'Fans', value: StoryType.SUBSCRIBER },
                          ]} />
                      </Form.Item>
                    </Col>
                  }
                  {platforms.includes(Platform.KNKY) &&
                    <Col span={12}>
                      <Form.Item label="Knky Story :">
                        <Radio.Group
                          value={knkyStoryType}
                          onChange={e => setKnkyStoryType(e.target.value)}
                          buttonStyle="solid"
                          optionType="button"
                          options={[
                            { label: 'None', value: StoryType.NONE },
                            { label: 'Public', value: StoryType.PUBLIC },
                            { label: 'Prime', value: StoryType.FOLLOWER },
                            { label: 'PayToView', value: StoryType.SUBSCRIBER },
                          ]} />
                      </Form.Item>
                    </Col>
                  }
                </Row>
              </Col>
              <Col span={12}>
                <Form.Item label="Folder">
                  <StyledInput
                    placeholder="Input folder name"
                    value={folder}
                    onChange={e => setFolder(e.target.value)} />
                </Form.Item>
                <Form.Item label="Images :">
                  <Upload
                    name="file"
                    multiple
                    action={`${SERVER_PATH}/api/upload`}
                    onChange={handleMediaChange}
                    fileList={fileList}
                  >
                    <Button icon={<LuUpload />}>Upload Images</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tags :">
                  <StyledInput
                    placeholder="#tag1 #tag2"
                    value={tagStr}
                    onChange={e => setTagStr(e.target.value)} />
                </Form.Item>
                <Form.Item label="Captions :">
                  <List
                    // size="large"
                    footer={
                      <Space.Compact style={{ width: '100%' }}>
                        <StyledInput
                          placeholder="input caption"
                          value={caption}
                          onChange={e => setCaption(e.target.value)}
                          onPressEnter={handleAppendCaption}
                        />
                        <Button type="primary" onClick={handleAppendCaption}>Add</Button>
                      </Space.Compact>
                    }
                    bordered
                    dataSource={captions}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          : <ImportContentTable
            onDelete={handleDeleteContent}
            dataSource={contents} />
        }
      </Card>
    </>
  )
}

export default AgencyImportContentPage;