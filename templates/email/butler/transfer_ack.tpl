<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%>

<% if(!_.isEmpty(password)) { %>
  <div style="
      display: flex;
      margin-left: 30px;
      margin-right: 30px;
      margin-bottom: 40px;
      text-align: left;
      background-color: #f7f7f9;
      border-radius: 6px;
      padding: 10px 10px 0 10px;
      ">
    <table style="
      text-align: center;
      margin-bottom: 0px;
      font-size: 15px;
      margin-top: 0px;
      text-align: left;
      ">
    <%= renderer.include('block/field.tpl',
      {name:_drumee_transfer_download_password,  value:password }) %>

    </table>
  </div>
<% } %>
<%= renderer.include('block/link.tpl', {label: _manage_transfer}) %>
<%= renderer.include('block/signature.tpl') %>
