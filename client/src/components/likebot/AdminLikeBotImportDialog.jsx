import { Modal, Form, Row, Col, Input, Upload, Button, Alert } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { Upload as UploadIcon } from "lucide-react";
import Papa from 'papaparse';

const AdminLikeBotImportDialog = ({
  open,
  onCancel,
  onImport,
}) => {

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [users, setUsers] = useState([]);

  const handleOkClick = () => {
    onImport && onImport(users);
  }

  const handleFileRead = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: result => {
        const data = result.data;
        const fields = result.meta.fields;
        let renamedData;
        if (fields.length < 7) {
          renamedData = data.map(item => ({
            firstName: item[fields[0]],
            lastName: item[fields[1]],
            gender: item[fields[2]],
            birthday: item[fields[3]]
          }));
        } else {
          renamedData = data.map(item => ({
            firstName: item[fields[0]],
            lastName: item[fields[1]],
            gender: item[fields[2]],
            birthday: item[fields[3]],
            orientation: item[fields[4]],
            role: item[fields[5]],
            city: item[fields[6]],
          }));
        }
        setUsers(renamedData);
      },
      error: err => {
        toast.error("Error parsing CSV file");
      }
    });
  }

  const handleBeforeUpload = file => {
    setFileList([file]);
    handleFileRead(file)
    return false;
  }

  return (
    <Modal
      title={"Import From File"}
      open={open}
      width={500}
      onOk={handleOkClick}
      onCancel={onCancel}>
      <Form
        // {...layout}
        layout="vertical"
        form={form}
        name="like-bot"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              // name="usersText"
              label="Csv File For Accounts"
              rules={[{ required: true }]}>
              <Upload
                accept=".csv"
                onRemove={() => { setFileList([]); setUsers([]) }}
                beforeUpload={handleBeforeUpload}
                fileList={fileList}
              >
                <Button icon={<UploadIcon />}>Select File</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col>
            {users.length > 0 && <Alert message={`${users.length} users will be imported.`} />}
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdminLikeBotImportDialog;