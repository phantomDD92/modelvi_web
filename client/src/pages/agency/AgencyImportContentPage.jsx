import { PageMetaData, StyledInput } from "@/components/common";
import { ImportContentTable } from "@/components/model";
import { importModelContents, loadModelList } from "@/redux/v2/actions";
import { Platform, SERVER_PATH, StoryType } from "@/utils/const";
import { getPlatformName, shuffleArray } from "@/utils/string";
import { Button, Card, Form, Row, Col, Upload, Space, Checkbox, Radio, message, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuCommand, LuStepBack, LuStepForward, LuUpload } from "react-icons/lu";

const PLATFORM_OPTIONS = [
  { label: 'F2F', value: Platform.F2F },
  { label: 'Knky', value: Platform.KNKY },
  { label: 'Fancentro', value: Platform.FNC },
  { label: 'Fansly', value: Platform.FAN },
  { label: 'Loyalfans', value: Platform.LOYALFANS },
  { label: 'Maloum', value: Platform.MALOUM },
  { label: 'Fanvue', value: Platform.FANVUE },
  { label: '4Based', value: Platform.FOURBASED },
  { label: 'MymFans', value: Platform.MYMFANS },
  { label: 'OnlyFans', value: Platform.ONLYFANS },
  { label: 'BestFans', value: Platform.BESTFANS },
  { label: 'FetLife', value: Platform.FETLIFE },
];

const beforeUpload = (file) => {
  const isAllowed = /\.(jpe?g|png|mp4|webm|avi)$/i.test(file.name);
  if (!isAllowed) {
    message.error(`${file.name} has an unsupported file type.`);
    return Upload.LIST_IGNORE;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'mov' || ext === 'heic') {
    message.error(`${file.name} is not allowed.`);
    return Upload.LIST_IGNORE;
  }
  return true;
}

const AgencyImportContentPage = () => {

  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [tagStr, setTagStr] = useState('');
  const [captionStr, setCaptionStr] = useState('');
  const [folder, setFolder] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [postTypes, setPostTypes] = useState({});
  const [price, setPrice] = useState();
  const [f2fStoryType, setF2fStoryType] = useState(StoryType.NONE);
  const [knkyStoryType, setKnkyStoryType] = useState(StoryType.NONE);
  const [contents, setContents] = useState([]);
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
  }, []);

  const handlePlatformsChange = (value) => {
    setPlatforms(value);
    const updated = {};
    value.forEach(p => { updated[p] = postTypes[p] || "FREE"; });
    setPostTypes(updated);
  }

  const handleNextClick = () => {
    if (!model) {
      message.warning("Please select a model");
      return;
    }
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
    if (Object.values(postTypes).includes('PAID') && (!price || price <= 0)) {
      message.warning("Please set a price for paid posts");
      return;
    }

    const captions = captionStr.split("\n").filter(line => line.trim() != "");
    if (captions.length == 0) {
      message.warning("Please input captions");
      return;
    }
    const mediaList = shuffleArray(fileList.filter(fileInfo => fileInfo.response?.file).map(fileInfo => ({ name: fileInfo.response?.file, mode: fileInfo.type, size: fileInfo.size })));
    setStep(ImportStep.IMPORT);
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
        postTypes: postTypes,
        price: Object.values(postTypes).includes('PAID') ? price : undefined,
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
          ? <Button type="primary" icon={<LuStepForward />} onClick={handleNextClick}>Next</Button>
          : <Space>
            <Button icon={<LuStepBack />} onClick={handleBackClick}>Back</Button>
            <Button type="primary" icon={<LuCommand />} onClick={handleFinishClick}>Finish</Button>
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
                    options={PLATFORM_OPTIONS.map(item => ({ label: item.label, value: item.value }))}
                    onChange={handlePlatformsChange} />
                </Form.Item>
                {platforms.length > 0 && (
                  <Form.Item label="Post Type :">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {platforms.map(p => {
                        const label = PLATFORM_OPTIONS.find(o => o.value === p)?.label || p;
                        return (
                          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 80, fontSize: 13, fontWeight: 500 }}>{label}</span>
                            <Radio.Group
                              size="small"
                              buttonStyle="solid"
                              optionType="button"
                              value={postTypes[p] || "FREE"}
                              onChange={(e) => setPostTypes({ ...postTypes, [p]: e.target.value })}>
                              <Radio.Button value="FREE">Free</Radio.Button>
                              <Radio.Button value="FANS">Fans</Radio.Button>
                              <Radio.Button value="PAID">Paid</Radio.Button>
                            </Radio.Group>
                          </div>
                        );
                      })}
                    </div>
                  </Form.Item>
                )}
                {Object.values(postTypes).includes('PAID') && (
                  <Form.Item label="Price :">
                    <InputNumber min={1} max={500} addonAfter="$" value={price} onChange={setPrice} />
                  </Form.Item>
                )}
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
                    <Button icon={<LuUpload />}>Upload Media</Button>
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
