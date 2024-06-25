<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_mail_sharebox.format(sender)
  }) 
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message }) %>
<% } %>

<%= renderer.include('block/link.tpl', {label: _mail_access_sharebox}) %>

<%= renderer.include('block/system-message.tpl', {
    text:sender
  }) 
%>


<%= renderer.include('block/note.tpl', {
    text:_note_sharebox
  }) 
%>