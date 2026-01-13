import { PageMetaData, StyledInput } from "@/components/common";
import { ImportContentTable } from "@/components/model";
import { importModelContents, loadModelList } from "@/redux/v2/actions";
import { Platform, SERVER_PATH, StoryType } from "@/utils/const";
import { getPlatformName, shuffleArray } from "@/utils/string";
import { Button, Card, Form, Row, Col, Upload, Space, Checkbox, Radio, message, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { Command, StepBack, StepForward, Upload as UploadIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const beforeUpload = (file) => {
  // Accept specific mime types or extensions
  const isAllowed = /\.(jpe?g|png|mp4|webm|avi)$/i.test(file.name);
  if (!isAllowed) {
    message.error(`${file.name} has an unsupported file type.`);
    return Upload.LIST_IGNORE; // prevents upload
  }
  // Optional: further filter by extension
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'mov' || ext === 'heic') {
    message.error(`${file.name} is not allowed.`);
    return Upload.LIST_IGNORE;
  }
  // If you want to allow, return true (or just omit)
  return true;
}

const AgencyImportContentPage = () => {

  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [tagStr, setTagStr] = useState('');
  const [captionStr, setCaptionStr] = useState('');
  const [folder, setFolder] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [f2fStoryType, setF2fStoryType] = useState(StoryType.NONE);
  const [knkyStoryType, setKnkyStoryType] = useState(StoryType.NONE);
  const [contents, setContents] = useState([]);
  // const { modelId } = useParams();
  const [model, setModel] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modelList = useSelector(state => state.v2.modelList);

  const ImportStep = {
    INPUT: 0,
    IMPORT: 2,
  }

  useEffect(() => {
    dispatch(loadModelList());
    // dispatch(getModelContents(modelId));
  }, []);

  const handleNextClick = () => {
    if (!model) {
      message.warning("Please select a model");
      return;
    }
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
    if (fileList.filter(fileInfo => !(fileInfo.response?.file)).length > 0) {
      message.warning("Please wait to upload all images");
      return;
    }

    const captions = captionStr.split("\n").filter(line => line.trim() != "");
    if (captions.length == 0) {
      message.warning("Please input captions");
      return;
    }
    const mediaList = shuffleArray(fileList.filter(fileInfo => fileInfo.response?.file).map(fileInfo => ({ name: fileInfo.response?.file, mode: fileInfo.type, size: fileInfo.size })));
    setStep(ImportStep.IMPORT);
    // prepare contents
    let importContents = [];
    let id = 0;
    const captionsLen = captions.length;
    const tags = tagStr.replaceAll("#", " ").trim().split(/\s+/);
    for (var media of mediaList) {
      const randomIndex = Math.floor(Math.random() * captionsLen);
      importContents.push({
        _id: id++,
        platforms: platforms,
        knkyStoryType,
        f2fStoryType,
        title: captions[randomIndex],
        postTags: tags,
        media,
        mode: (media.mode || "image").split("/")[0],
        folder: folder,
      });
    }
    setContents(importContents);
  }

  const handleBackClick = () => {
    setStep(ImportStep.INPUT);
  }
  const handleFinishClick = () => {
    dispatch(importModelContents(model, contents, () => navigate(`/model/${model}`)));
  }

  const handleDeleteContent = (content) => {
    const newContents = [...contents];
    const contentIndex = newContents.findIndex(item => item._id == content._id)
    if (contentIndex >= 0) {
      newContents.splice(contentIndex, 1);
    }
    setContents(newContents);
  }

  const handleMediaChange = ({ fileList }) => {
    setFileList(fileList);
  }

  return (
    <>
      <PageMetaData title="Import" />
      <Card
        title={"Import Contents"}
        extra={step == ImportStep.INPUT
          ? <Button type="primary" icon={<StepForward />} onClick={handleNextClick}>Next</Button>
          : <Space>
            <Button icon={<StepBack />} onClick={handleBackClick}>Back</Button>
            <Button type="primary" icon={<Command />} onClick={handleFinishClick}>Finish</Button>
          </Space>
        }
      >
        <Form.Item label="Model" className="px-10">
          <Select
            className="max-w-[300px]"
            options={(modelList || [])
              .map(model => ({
                label: `${model.number}. ${model.name}`,
                value: model._id
              }))}
            showSearch
            value={model}
            onChange={value => setModel(value)}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
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
                <Form.Item label="Media :">
                  <Upload
                    beforeUpload={beforeUpload}
                    accept="image/*,video/*"
                    name="file"
                    multiple
                    action={`${SERVER_PATH}/api/upload`}
                    onChange={handleMediaChange}
                    fileList={fileList}
                  >
                    <Button icon={<UploadIcon />}>Upload Media</Button>
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
                  <Input.TextArea
                    value={captionStr}
                    onChange={e => setCaptionStr(e.target.value)}
                    rows={10}
                  // maxLength={30}
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