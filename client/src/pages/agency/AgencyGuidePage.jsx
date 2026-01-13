import { PageMetaData } from "@/components/common"
import { Card, Collapse, Typography } from "antd"

const { Paragraph, Text } = Typography;
export const AgencyGuidePage = () => {
    const items = [
        {
            key: '1',
            label: <h5>1. Create Model</h5>,
            children: <div className="p-4">
                <img src="/img/guide1.jpg"/>
                <p>Check if the number is available, Model number is just for organisation may some models ever have the same names</p>
                <p>After Model creation you can setup content inside the model and use it to post on accounts you’ll make later</p>
                <p>URL: &nbsp;<a href="https://modelvi.com/model">https://modelvi.com/model</a></p>
            </div>,
        },
        {
            key: '2',
            label: <h5>2. Create Account</h5>,
            children: <div className="p-4">
                <img src="/img/guide2.jpg"/>
                <p>Select the model</p>
                <p>Alias can be found is the model’s profile URL slug</p>
                <p>For example: F2F.com/Lisa  Lisa is the alias</p>
                <br />
                <p>Chat team is optional, its for chat notifications</p>
                <p>Security Key is the 2FA secret key required with some platforms</p>
                <p>Accounts need to created for each active platform</p>
            </div>,
        },
        {
            key: '3',
            label: <h5>3. Bot Settings</h5>,
            children: <div className="p-4">
                <img src="/img/guide3.jpg"/>
                <p>Posting methods:</p>
                <p>Interval, Choose a fixed amount of minutes posts</p>
                <p>Offset, Choose exact minutes to post on</p>
                <p>Live Posts, Posts that remain visible on the profile before deletion. when 3, 4th post gets removed (always)</p>
            </div>,
        },
        {
            key: '4',
            label: <h5>4. Import Content</h5>,
            children: <div className="p-4">
                <img src="/img/guide4.jpg"/>
                <p>Easily import content per or for multiple platforms</p>
                <p>Recommended to match languages for captions with platform markets</p>
                <p>Offset, Choose exact minutes to post on</p>
                <p>Make sure to create a model first, Upload contents to her</p>
                <p>Setup her accounts and settings after</p>
            </div>,
        },
        {
            key: '5',
            label: <h5>5. Set up Comments</h5>,
            children: <div className="p-4">
                <img src="/img/guide5.jpg"/>
                <p>Comments are reused across all models and platforms</p>
                <p>When comment interval expires it posts a comment on the most recent post in the explore page</p>
                <p>Make sure to have at least 3 comments when posting a comment every 30 minutes per model</p>
            </div>,
        },
        {
            key: '6',
            label: <h5>6. Scheduled Posting</h5>,
            children: <div className="p-4">
                <img src="/img/guide6.jpg"/>
                <p>Schedule your daily posting across all platforms easily.</p>
                <p>Schedule Public, Fan only or Paid posts.</p>
                <p>No limits for scheduling</p>
                <p>Make sure to schedule at least 30 minutes before actual posting time</p>
            </div>,
        },
    ];
    return <>
        <PageMetaData title="Guide" />
        <Card title="Guide">
            <div className="p-6">
                <Typography.Title level={3}>Modelvi Traffic Automation</Typography.Title>
                <Paragraph>ModelVI automates posting, comments, stories, and more across multiple platforms, keeping you active, boosting engagement, and driving traffic from FYP and Explore pages.</Paragraph>
                <Text strong>  Set up your content once and instantly copy it across 10+ platforms, saving time while staying active everywhere.</Text>
                <Collapse items={items} className="mt-6" />
            </div>
        </Card>
    </>
}

export default AgencyGuidePage;