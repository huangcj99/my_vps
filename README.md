���˲ֿ����ݽ�Ϊѧϰʹ�ã��ɷ���104.194.93.138�����ֹ����޷�ʹ�ã���cookie��ع��ܣ�

	github:  git@github.com:smallcatcat-joe/my_vps.git

ע��Ŀ¼charmingHuiΪXX����վ����ļ�
    �ɽ���ע�ᡢ��¼ҳ����ת�Լ�session״̬����
    �÷������ű���Ϊ����Զ�����ݿ⣬ip��ַΪ104.194.93.138
    	

1����ִ��npm��װmongoose,���������������ű�index.js

	server.jsΪ������������ͨ���������ͷ������ֱ���뵽method.js�в�ͬ�ĺ�����
	method.js��ͨ��·�����������ϸ��(�����ļ��ķ��������ݵ�����)��

2�����������������localhost:8080 + ��Ŀ�ļ�·�����ɷ�����Ӧҳ��

	�磺localhost:8080/charmingHui/src/index.html��
	�������ļ�����ͨ��·�������ļ�����ҳ��ֱ�ӷ���localhost:8080��

	��ҳͼƬ·��ͨ��ajax�����������Ȼ��ͨ�����ݿⷵ�ص����ݽ���src����

3��charming_account/account.js
	
	ע�ᡢ��¼ҳ���������Զ��mongodb���ݿ�Ľ������Լ��й�session����ҳ���¼״̬�Ľű���
	�����н���ע��ҳ�����ע�ᣬ�����ڼ������ݿ�ǰ�����˵�����ܣ�
	session_id������expiresΪ1�졢httpOnly��������document.cookie���и��ġ�

4��charmingHui/src/server_node/crepper.js

	ִ��crepper�ɻ�ȡ��վ��ҳ�Լ�������Ʒ�б�ҳ��img��

	��ȡ�µ�ͼƬ��Դ���·����
		src/img/list�µ�ͼƬΪ��������ҳ�������ģ���img��
		src/img/commodity_list/pop_up1~5�ֱ�ΪŮʿ����ʿ����ױ���Ҿӡ�Ӥͯ�µ���Ʒ����ҳ���img��
	(�ϴ���ֻ�������ͼƬ��github����)

5��charmingHui/server_node/homepage_img_href.js
	
	ִ�д˽ű��ɽ�src/img/list/homepage�µ�ͼƬ������·����ӵ�Զ�����ݿ�104.194.93.138�ϣ�
	��ͨ��ajax�������ݿ�����ҳ��ͼƬ���ݣ����г�ʼ����(��ع��ܽű���charming_get_img�ļ�����)��

