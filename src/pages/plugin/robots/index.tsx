import { pluginGetRobots, pluginSaveRobots } from '@/services/plugin/robots';
import { PageContainer, ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Alert, Button, Card, message } from 'antd';
import React, { useEffect, useState } from 'react';

const PluginRobots: React.FC<any> = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [pushSetting, setPushSetting] = useState<any>({});
  const [fetched, setFetched] = useState<boolean>(false);
  const intl = useIntl();

  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    const res = await pluginGetRobots();
    let setting = res.data || {};
    setPushSetting(setting);
    setFetched(true);
  };

  const onSubmit = async (values: any) => {
    const hide = message.loading(intl.formatMessage({ id: 'setting.system.submitting' }), 0);
    pluginSaveRobots(values)
      .then((res) => {
        message.success(res.msg);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        hide();
      });
  };

  const getFrontUrl = async (link: string) => {
    let baseUrl = '';
    if (!initialState?.system) {
      const system = await initialState?.fetchSystemSetting?.();
      if (system) {
        await setInitialState((s) => ({
          ...s,
          system: system,
        }));
      }
      baseUrl = system?.base_url || '';
    } else {
      baseUrl = initialState.system?.base_url || '';
    }

    return baseUrl + link;
  };

  return (
    <PageContainer>
      <Card>
        <Alert
          message={
            <div>
              <FormattedMessage id="plugin.robots.tips.before" />
              <a href="https://baike.baidu.com/item/robots%E5%8D%8F%E8%AE%AE/2483797">
              <FormattedMessage id="plugin.robots.tips.after" />
              </a>
            </div>
          }
        />
        <div className="mt-normal">
          {fetched && (
            <ProForm onFinish={onSubmit} initialValues={pushSetting}>
              <ProFormTextArea
                name="robots"
                fieldProps={{
                  rows: 15,
                }}
                label={intl.formatMessage({ id: 'plugin.robots.content' })}
                extra={
                  <div>
                    <p>
                      <FormattedMessage id="plugin.robots.content.tips1" />
                    </p>
                    <p>
                      <FormattedMessage id="plugin.robots.content.tips2" />
                    </p>
                  </div>
                }
              />
            </ProForm>
          )}
        </div>
        <div className="mt-normal">
          <Button
            onClick={async () => {
              let url = await getFrontUrl('/robots.txt');
              window.open(url);
            }}
          >
            <FormattedMessage id="plugin.robots.view" />
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PluginRobots;
