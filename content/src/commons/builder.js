const DEFAULT_ENVIRONMENT_ID = 'production';

class Builder {
  currentEnvironmentId = DEFAULT_ENVIRONMENT_ID;
  token = null;

  init() {
    this.token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMmI5N2YyMWFmMjNlNjY4NjA5ZDI0NDliZjZjMWY0NzZlMTlkMWIifQ.eyJpc3MiOiJodHRwczovL2RleC5reW1hLmxvY2FsIiwic3ViIjoiQ2lReE9HRTROamcwWWkxa1lqZzRMVFJpTnpNdE9UQmhPUzB6WTJReE5qWXhaalUwTmpNU0JXeHZZMkZzIiwiYXVkIjpbImt5bWEtY2xpZW50IiwiY29uc29sZSJdLCJleHAiOjE1MzU5ODM1NjcsImlhdCI6MTUzNTg5NzE2NywiYXpwIjoiY29uc29sZSIsIm5vbmNlIjoicmxqZmlWNXQ5NEJxN1dLNzdKYmdMcWU1Ulc1Zno0UTJoNjI2aEdWbCIsImF0X2hhc2giOiJtbnpUVHdpZkZCcE53RlJYSE5lU21nIiwiZW1haWwiOiJhZG1pbkBreW1hLmN4IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJhZG1pbiJ9.uVk3CPihoAn61XpSZTT7xQBKq2O4KOZtnbqYDrIadhcszNorRtog0KmYicM1ZipuH084nmbmGjiZOdcGb_NZsbW9HMW_pXCPaQGfEYXkaEaens7nM57TYhub_U-2C6leL2eXt9gJ77P53WZwuSfQ5bbkvCEQ6Aw3KIl070BML4rlb81jqp7i9bwOFsZelVNtgUS0H_BYMiPyyio5j6o99I-_LQr3sN4SFCewdo-s7s1WOrJheVZUjYzTsTCwpc4MZL_DY7lO1Li8LTDk7J_XDuCqxZ40FHPgv2kAPnUZbNs-tDs5NQr5e7eALLufjASLdhrArNPZAWflLyMi8W2Xpw'
    return new Promise((resolve, reject) => {
      if (process.env.REACT_APP_ENV === 'production') {
        resolve();
        return;
      }
      const timeout = setTimeout(resolve, 1000);
      window.addEventListener('message', e => {
        if (!e.data) return;
        const data = e.data;

        if (data.msg === 'init') {
          const context = e.data[1];
          this.currentEnvironmentId = context.currentEnvironmentId;
          this.token = context.idToken;
        }

        clearTimeout(timeout);
        resolve();
      });
    });
  }

  getBearerToken() {
    if (!this.token) {
      return null;
    }
    return `Bearer ${this.token}`;
  }

  getCurrentEnvironmentId() {
    return this.currentEnvironmentId;
  }
}

const builder = new Builder();

export default builder;
