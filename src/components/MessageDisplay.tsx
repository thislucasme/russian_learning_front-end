import React, { useImperativeHandle, forwardRef } from 'react';
import { message } from 'antd';

interface MessageDisplayProps {
  type: 'success' | 'error' | 'warning';
  content: string;
}

const MessageDisplay = forwardRef(({ type, content }: MessageDisplayProps, ref) => {
  const [messageApi, contextHolder] = message.useMessage();

  useImperativeHandle(ref, () => ({
    showMessage() {
      messageApi.open({
        type,
        content,
      });
    }
  }));

  return <>{contextHolder}</>;
});

export default MessageDisplay;
